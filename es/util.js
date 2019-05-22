'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleReq = exports.replaceDomain = exports.injectScripts = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.makeSpinner = makeSpinner;
exports.getIPAdress = getIPAdress;
exports.writeFile = writeFile;
exports.forceRequire = forceRequire;
exports.purgeCache = purgeCache;
exports.searchCache = searchCache;

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _cliSpinner = require('cli-spinner');

var _cliSpinner2 = _interopRequireDefault(_cliSpinner);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Spinner = _cliSpinner2.default.Spinner;
var log = (0, _logger2.default)("util");

function makeSpinner(txt) {
    var spinner = new Spinner(txt + ' %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    return spinner;
}
/**
 * 注入javascript脚本
 * @param {*} scripts 脚本链接url或者是脚本内容
 */
var injectScripts = exports.injectScripts = function injectScripts(scripts) {
    return function (body) {
        var _script = "";
        scripts.forEach(function (script) {
            if (script.match("//")) {
                _script += '<script src="' + script + '"></script>';
            } else {
                _script += '<script>' + script + '</script>';
            }
        });

        return String(body).replace('<head>', '<head>' + _script);
    };
};
/**
 * 根据domainy的配置（支持替换__ip__为server的ip），匹配的domain换成ip
 * domainy: [{
        // proxy domain config, if not for remote debug, no need to config
        path: "//g.alicdn.com",
        data: "//__ip__:8889"
    }],
 * @param {*} domainy 
 * @param {*} ip 
 */
var replaceDomain = exports.replaceDomain = function replaceDomain(domainy, ip) {
    return function (body) {
        var bb = String(body);
        domainy.forEach(function (domain) {
            bb = bb.replace(new RegExp(domain.path, 'gi'), domain.data.replace("__ip__", ip));
        });
        return bb;
    };
};
/**
 * 将匹配到path规则的url地址转换成对应的配置
 * proxy: {
        host: [{
            path: new RegExp("(\\.js|\\.css)"),
            data: "g.alicdn.com"
        }, {
            path: new RegExp(".*"),
            data: "test.tmall.com"
        }],
        hostname: [{
            path: new RegExp(".*"),
            data: "127.0.0.1"
        }],
        port: [{
            path: new RegExp("(\\.js|\\.css)"),
            data: 8000
        }, {
            path: new RegExp(".*"),
            data: 3000
        }]
    }
 * @param {*} proxy 
 */
var handleReq = exports.handleReq = function handleReq(proxy) {
    return function (options) {

        var urlPath = options.url;
        // http 1.1中不能缺失host行，如果缺失，服务器返回400 bad request 
        var hostRule = proxy.host.find(function (item) {
            return urlPath.match(new RegExp(item.path));
        });
        options.headers.host = hostRule.data;

        options.uri = _url2.default.parse(urlPath);

        var portRule = proxy.port.find(function (item) {
            return urlPath.match(new RegExp(item.path));
        });
        options.uri.port = portRule.data;

        var hostNameRule = proxy.hostname.find(function (item) {
            return urlPath.match(new RegExp(item.path));
        });
        options.uri.hostname = hostNameRule.data;

        options.uri.protocol = 'http:';

        options.uri = _url2.default.format(options.uri);

        log.info('URL proxy: ', urlPath.slice(0, 100), options.uri.slice(0, 100));
        return options;
    };
};

function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

function writeFile(src, dist) {
    var content = _fs2.default.readFileSync(src);
    _fs2.default.writeFileSync(dist, content);
}

function forceRequire(path) {
    purgeCache(path);
    return require(path);
}

/**
 * 从缓存中移除module
 */
function purgeCache(moduleName) {
    // 遍历缓存来找到通过指定模块名载入的文件
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });

    // 删除模块缓存的路径
    (0, _keys2.default)(module.constructor._pathCache).forEach(function (cacheKey) {
        if (cacheKey.indexOf(moduleName) > 0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
};

/**
 * 遍历缓存来查找通过特定模块名缓存下的模块
 */
function searchCache(moduleName, callback) {
    //  通过指定的名字resolve模块
    var mod = require.resolve(moduleName);

    // 检查该模块在缓存中是否被resolved并且被发现
    if (mod && (mod = require.cache[mod]) !== undefined) {
        // 递归的检查结果
        (function traverse(mod) {
            // 检查该模块的子模块并遍历它们
            mod.children.forEach(function (child) {
                traverse(child);
            });

            // 调用指定的callback方法，并将缓存的module当做参数传入
            callback(mod);
        })(mod);
    }
};
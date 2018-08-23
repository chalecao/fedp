'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleReq = exports.injectScripts = undefined;
exports.applyDomain = applyDomain;
exports.makeSpinner = makeSpinner;
exports.getIPAdress = getIPAdress;
exports.writeFile = writeFile;

var _domain = require('@ali/tbdomain/domain');

var _domain2 = _interopRequireDefault(_domain);

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

function applyDomain() {

    return _domain2.default.applyDomain('', 'taobao').then(function (domainInfo) {
        var domain = domainInfo.alias || domainInfo.domain;

        log.warn('Domain apply success: ' + domain);
        return domain;
    }, function (err) {

        log.warn('Domain apply fail!');
        return null;
    });
}

function makeSpinner(txt) {
    var spinner = new Spinner(txt + ' %s');
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    return spinner;
}

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
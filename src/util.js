import logger from "./logger"
import url from 'url'
import Spin from 'cli-spinner'
import fs from 'fs'

const Spinner = Spin.Spinner;
const log = logger("util");

export function makeSpinner(txt) {
    let spinner = new Spinner(`${txt} %s`);
    spinner.setSpinnerString('|/-\\');
    spinner.start();
    return spinner;
}
/**
 * 注入javascript脚本
 * @param {*} scripts 脚本链接url或者是脚本内容
 */
export const injectScripts = (scripts) => (body) => {
    let _script = ""
    scripts.forEach(script => {
        if (script.match("//")) {
            _script += `<script src="${script}"></script>`;
        } else {
            _script += `<script>${script}</script>`;
        }
    })
    let bd = String(body)
    console.log(bd)
    if (bd.match("DOCTYPE") && bd.match("head") && bd.match("body") && bd.match("html")) {
        return String(body).replace('<head>', `<head>${_script}`);
    } else {
        return String(body);
    }

}
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
export const replaceDomain = (domainy, ip) => (body) => {
    let bb = String(body)
    domainy.forEach(domain => {
        bb = bb.replace(new RegExp(domain.path, 'gi'), domain.data.replace("__ip__", ip));
    })
    return bb
}
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
export const handleReq = (proxy) => (options) => {

    let urlPath = options.url;
    // http 1.1中不能缺失host行，如果缺失，服务器返回400 bad request 
    let hostRule = proxy.host.find(item => urlPath.match(new RegExp(item.path)))
    options.headers.host = hostRule.data;

    options.uri = url.parse(urlPath);

    let portRule = proxy.port.find(item => urlPath.match(new RegExp(item.path)))
    options.uri.port = portRule.data;

    let hostNameRule = proxy.hostname.find(item => urlPath.match(new RegExp(item.path)))
    options.uri.hostname = hostNameRule.data;

    options.uri.protocol = 'http:';

    options.uri = url.format(options.uri);

    log.info('URL proxy: ', urlPath.slice(0, 100), options.uri.slice(0, 100));
    return options;
}

export function getIPAdress() {
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

export function writeFile(src, dist) {
    let content = fs.readFileSync(src)
    fs.writeFileSync(dist, content)
}

export function forceRequire(path) {
    purgeCache(path)
    return require(path)
}

/**
 * 从缓存中移除module
 */
export function purgeCache(moduleName) {
    // 遍历缓存来找到通过指定模块名载入的文件
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });

    // 删除模块缓存的路径
    Object.keys(module.constructor._pathCache).forEach(function (cacheKey) {
        if (cacheKey.indexOf(moduleName) > 0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
};

/**
 * 遍历缓存来查找通过特定模块名缓存下的模块
 */
export function searchCache(moduleName, callback) {
    //  通过指定的名字resolve模块
    var mod = require.resolve(moduleName);

    // 检查该模块在缓存中是否被resolved并且被发现
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // 递归的检查结果
        (function traverse(mod) {
            // 检查该模块的子模块并遍历它们
            mod.children.forEach(function (child) {
                traverse(child);
            });

            // 调用指定的callback方法，并将缓存的module当做参数传入
            callback(mod);
        }(mod));
    }
};
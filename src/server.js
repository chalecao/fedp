import http from 'http'
import url from 'url'
import httpClient from 'request'
import logger from "./logger"
import { resolve } from 'path';
import { forceRequire } from "./util"

const log = logger("server");
let headerHandlers = [];
let bodyHandlers = [];
let requestHandlers = [];
let interfaceHandlers = [];

function isAssets(options) {
    return /\.(?:mp[\dv]|jpg|gif|png|jpeg|ogg|acx|ico|zip|rar)$/i.test(options.url)
}

function matchInterface({ url }) {
    if (url.match("\\.js") || url.match("\\.css")) return false;
    return interfaceHandlers.find((rule) => {
        if (rule && rule.path && new RegExp(rule.path, "g").exec(url)) {
            return true;
        }
    });
}
function matchCDP(CDP, url) {
    if (!CDP) return false;
    let pages = CDP.getInstance().pages;
    let scriptmocky = [];
    pages && pages.forEach(page => {
        let mockscripts = page.mockscripts;
        mockscripts && Object.keys(mockscripts).forEach(key => [
            // {url:'', content:''}
            scriptmocky.push({
                path: mockscripts[key].url,
                data: mockscripts[key].content,
            })
        ])
    })
    // console.log(url, "scriptmocky", JSON.stringify(scriptmocky).slice(0, 10000))
    return scriptmocky.find((rule) => {
        if (rule && (rule.path.match(url))) {
            return true;
        }
    });
}

function handleHeader(url, res, body) {
    headerHandlers.reverse().forEach(handler => {
        handler(res)
    });
    delete res.headers['content-length'];
    return res.headers;
}

function handleBody(body, url) {
    bodyHandlers.reverse().forEach(handler => {
        body = handler(body, url)
    });
    return body;
}

function handleRequest(requestOptions) {
    requestHandlers.reverse().forEach(handler => {
        requestOptions = handler(requestOptions)
    });
    return requestOptions;
}

export function hookHeaderHandler(handler) {
    headerHandlers.push(handler)
}

export function hookBodyHandler(handler) {
    bodyHandlers.push(handler)
}

export function hookRequestHandler(handler) {
    requestHandlers.push(handler)
}

export function hookInterfaceHandler(handler) {
    if (Array.isArray(handler)) {
        interfaceHandlers = interfaceHandlers.concat(handler)
    } else {
        interfaceHandlers.push(handler)
    }
}

function mockResponse(response, url, rule) {
    let contype = 'application/json';
    let res = ""
    if (typeof rule.data == "string") {
        if (rule.data.substr(-5) == ".json") {
            res = JSON.stringify(forceRequire(resolve(rule.data)))
        } else {
            if (rule.data.substr(-3) == ".js") {
                res = JSON.stringify(forceRequire(resolve(rule.data)))
            }
            contype = 'application/javascript; charset=utf-8';
        }
    }
    if (typeof rule.data == "object") {
        res = JSON.stringify(rule.data)
    }
    let callbackName = new RegExp("callback=(.*)&", "g").exec(url);
    if (callbackName && callbackName[1]) {
        response.writeHead(200, {
            'Content-Type': contype,
            'Access-Control-Allow-Origin': rule.origin || "*",
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'set-cookie': rule.cookie || ""
        });
        response.end(callbackName[1] + "(" + res + ")");
    } else {
        response.writeHead(200, {
            'Content-Type': contype,
            'Access-Control-Allow-Origin': rule.origin || "*",
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'set-cookie': rule.cookie || ""
        });
        response.end(res);
    }
}

function proxyResponse(requestOptions, rule) {
    if (rule.routeTo && rule.routeTo.match("//")) {
        // log.warn("route to : ", requestOptions)
        requestOptions.origin = "https://taobao.com/"
        requestOptions.referer = "https://taobao.com/"
        requestOptions.uri = url.parse(requestOptions.url);
        requestOptions.headers.host = "h5api.wapa.taobao.com";
        requestOptions.uri.hostname = url.parse(rule.routeTo).hostname;
        requestOptions.uri.protocol = url.parse(rule.routeTo).protocol;
        requestOptions.uri = url.format(requestOptions.uri);
        requestOptions.cookie = requestOptions.cookie || rule.cookie
        log.warn("route to : ", requestOptions.uri)
        return requestOptions
    }
    return requestOptions;
}

export function createServer(port, cdp) {
    /**
     * https://github.com/request/request#requestoptions-callback
     */
    http.createServer(function (request, response) {
        let { method, url, headers } = request;
        let requestOptions = handleRequest({ method, url, headers });
        try {
            if (isAssets(requestOptions)) {
                log.warn("Assets matched for: ", url)
                httpClient(requestOptions).pipe(response);

            } else {
                let rule = matchInterface(requestOptions) || matchCDP(cdp, requestOptions.url);
                if (rule && rule.data) {
                    log.warn("mock rule matched for: ", url)
                    mockResponse(response, url, rule);

                } else {
                    rule && (requestOptions = proxyResponse(requestOptions, rule));
                    requestOptions.gzip = true
                    httpClient(requestOptions, function (error, res, body) {
                        if (error) {
                            response.end('error: ' + error.message);
                        } else {
                            let header = handleHeader(url, res, body);
                            body = handleBody(body, url);
                            header['content-encoding'] = "";
                            if (res.headers['set-cookie']) {
                                header['set-cookie'] = res.headers['set-cookie'].map(item => item.replace(/Domain=.*com;/gi, ""));
                            }
                            response.writeHead(res.statusCode, header);
                            response.end(body);
                        }
                    });
                }
            }
        } catch (e) {
            log.debug("error", e)
        }
    }).listen(port);
}


'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.hookHeaderHandler = hookHeaderHandler;
exports.hookBodyHandler = hookBodyHandler;
exports.hookRequestHandler = hookRequestHandler;
exports.hookInterfaceHandler = hookInterfaceHandler;
exports.createServer = createServer;

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _path = require('path');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logger2.default)("server");
var headerHandlers = [];
var bodyHandlers = [];
var requestHandlers = [];
var interfaceHandlers = [];

function isAssets(options) {
    return (/\.(?:mp[\dv]|jpg|gif|png|jpeg|ogg|acx|ico|zip|rar)$/i.test(options.url)
    );
}

function matchInterface(_ref) {
    var url = _ref.url;

    return interfaceHandlers.find(function (rule) {
        if (rule && rule.path && new RegExp(rule.path).exec(url)) {
            return true;
        }
    });
}

function handleHeader(url, res, body) {
    headerHandlers.reverse().forEach(function (handler) {
        handler(res);
    });
    delete res.headers['content-length'];
    return res.headers;
}

function handleBody(body) {
    bodyHandlers.reverse().forEach(function (handler) {
        body = handler(body);
    });
    return body;
}

function handleRequest(requestOptions) {
    requestHandlers.reverse().forEach(function (handler) {
        requestOptions = handler(requestOptions);
    });
    return requestOptions;
}

function hookHeaderHandler(handler) {
    headerHandlers.push(handler);
}

function hookBodyHandler(handler) {
    bodyHandlers.push(handler);
}

function hookRequestHandler(handler) {
    requestHandlers.push(handler);
}

function hookInterfaceHandler(handler) {
    if (Array.isArray(handler)) {
        interfaceHandlers = interfaceHandlers.concat(handler);
    } else {
        interfaceHandlers.push(handler);
    }
}

function mockResponse(response, url, rule) {

    var callbackName = new RegExp("callback=(.*)&", "g").exec(url);
    if (callbackName && callbackName[1]) {
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': rule.origin || "*",
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'set-cookie': rule.cookie || ""
        });
        response.end(callbackName[1] + "(" + (0, _stringify2.default)(rule.data) + ")");
    } else {
        response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': rule.origin || "*",
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'set-cookie': rule.cookie || ""
        });
        response.end((0, _stringify2.default)(rule.data));
    }
}

function proxyResponse(requestOptions, rule) {
    if (rule.routeTo.match("//")) {
        var _targetUrl = rule.routeTo;
        var callbackName = new RegExp("callback=(.*)&", "g").exec(requestOptions.url);
        if (callbackName && callbackName[1]) {
            _targetUrl += "?callback=" + callbackName[1];
        }
        requestOptions.url = _targetUrl;
    }
    requestOptions.headers.host = _url2.default.parse(targetUrl).hostname;
    return requestOptions;
}

function createServer(port) {
    /**
     * https://github.com/request/request#requestoptions-callback
     */
    _http2.default.createServer(function (request, response) {
        var method = request.method,
            url = request.url,
            headers = request.headers;

        var requestOptions = handleRequest({ method: method, url: url, headers: headers });
        try {
            if (isAssets(requestOptions)) {
                (0, _request2.default)(requestOptions).pipe(response);
            } else {
                var rule = matchInterface(requestOptions);
                if (rule && rule.data) {
                    mockResponse(response, url, rule);
                } else {

                    rule && (requestOptions = proxyResponse(requestOptions, rule));

                    (0, _request2.default)(requestOptions, function (error, res, body) {
                        if (error) {
                            response.end('error: ' + error.message);
                        } else {
                            var header = handleHeader(url, res, body);
                            body = handleBody(body);
                            response.writeHead(res.statusCode, header);
                            response.end(body);
                        }
                    });
                }
            }
        } catch (e) {
            log.debug("error", e);
        }
    }).listen(port);
}
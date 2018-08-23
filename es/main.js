'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _util = require('./util');

var _server = require('./server');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _mock = require('./mock');

var _mock2 = _interopRequireDefault(_mock);

var _shell = require('./shell');

var _bopen = require('bopen');

var _bopen2 = _interopRequireDefault(_bopen);

var _anydebugger = require('anydebugger');

var _anydebugger2 = _interopRequireDefault(_anydebugger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _logger2.default)("main");

exports.default = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(port, config) {
        var spinner, scripts, proxy, cmds, debug, mock, debugPort, domain, mocky, ip, newdomain, mockPaths;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        spinner = (0, _util.makeSpinner)('start wrapper ...');
                        scripts = config.scripts, proxy = config.proxy, cmds = config.cmds, debug = config.debug, mock = config.mock, debugPort = config.debugPort, domain = config.domain, mocky = config.mocky;
                        ip = (0, _util.getIPAdress)();
                        newdomain = ip;

                        if (!(typeof domain == "string")) {
                            _context.next = 8;
                            break;
                        }

                        newdomain = domain;
                        _context.next = 12;
                        break;

                    case 8:
                        if (!domain) {
                            _context.next = 12;
                            break;
                        }

                        _context.next = 11;
                        return (0, _util.applyDomain)();

                    case 11:
                        newdomain = _context.sent;

                    case 12:
                        log.info('start ...');
                        log.info('domain: ' + newdomain + ', ip: ' + ip);
                        port = port || config.port;
                        //注入处理函数
                        (0, _server.hookRequestHandler)((0, _util.handleReq)(proxy));
                        (0, _server.hookBodyHandler)((0, _util.injectScripts)(scripts));
                        //配置mock
                        (0, _server.hookInterfaceHandler)(mocky);
                        // 运行服务
                        mockPaths = (0, _stringify2.default)(mocky.map(function (rule) {
                            return rule.path;
                        }));

                        if (!mock) {
                            mockPaths = "null";
                        }
                        (0, _server.hookBodyHandler)((0, _util.injectScripts)(['window.mockPaths = ' + mockPaths + ';', '(' + _mock2.default.toString() + ')()']));

                        if (debug) {
                            (0, _anydebugger2.default)(debugPort, true);
                            (0, _server.hookBodyHandler)((0, _util.injectScripts)(['//' + ip + ':' + debugPort + '/static/js/anydebugger.js']));
                            log.info('debug server start successfully at ' + newdomain + ':' + debugPort + ' !');
                        }
                        (0, _shell.runCmds)(cmds);
                        //启动服务
                        try {
                            (0, _server.createServer)(port);
                        } catch (e) {
                            log.debug("error: ", e);
                        }
                        log.info('server start successfully at ' + newdomain + ':' + port + ' !');

                        spinner.stop(true);
                        (0, _shell.getLink)(newdomain + ':' + port).then(function (url) {
                            log.warn('you can visit you project at ' + url + ' !');
                            // url && bopen(url);
                            if (debug) {
                                (0, _bopen2.default)('http://' + newdomain + ':' + debugPort + '?url=' + url);
                            }
                        });

                    case 27:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    function createApp(_x, _x2) {
        return _ref.apply(this, arguments);
    }

    return createApp;
}();

module.exports = exports['default'];
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

var _mockMtop = require('./mock-mtop');

var _mockMtop2 = _interopRequireDefault(_mockMtop);

var _shell = require('./shell');

var _bopen = require('bopen');

var _bopen2 = _interopRequireDefault(_bopen);

var _anydebugger = require('anydebugger');

var _anydebugger2 = _interopRequireDefault(_anydebugger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//mockMtop hack mtop request, add handleRequestWillBeSent handleDataReceived for chrome debug，wapa:预发，m:线上，waptest:日常
var log = (0, _logger2.default)("main");

exports.default = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(pp, config) {
        var spinner, _forceRequire, scripts, proxy, cmds, debug, mock, debugPort, domain, mtopEnv, mocky, domainy, simulator, urlsuffix, debuglog, port, ip, newdomain, oport, mockPaths, CDP;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        spinner = (0, _util.makeSpinner)('start wrapper ...');
                        _forceRequire = (0, _util.forceRequire)(config), scripts = _forceRequire.scripts, proxy = _forceRequire.proxy, cmds = _forceRequire.cmds, debug = _forceRequire.debug, mock = _forceRequire.mock, debugPort = _forceRequire.debugPort, domain = _forceRequire.domain, mtopEnv = _forceRequire.mtopEnv, mocky = _forceRequire.mocky, domainy = _forceRequire.domainy, simulator = _forceRequire.simulator, urlsuffix = _forceRequire.urlsuffix, debuglog = _forceRequire.debuglog, port = _forceRequire.port;
                        ip = (0, _util.getIPAdress)();
                        newdomain = ip;

                        if (typeof domain == "string") {
                            newdomain = domain;
                        }
                        log.info('start ...');
                        log.info('domain: ' + newdomain + ', ip: ' + ip);
                        oport = pp || port;
                        //注入处理函数

                        (0, _server.hookRequestHandler)((0, _util.handleReq)(proxy));
                        (0, _server.hookBodyHandler)((0, _util.injectScripts)(scripts));
                        if (mock) {
                            //配置接口mock规则，在接口请求时会按这个规则匹配
                            (0, _server.hookInterfaceHandler)(mocky);
                            // 提取出接口mock规则的路径，注入页面的mtop hack脚本会匹配路径，匹配到了请求本地，否则走默认mtop请求
                            mockPaths = (0, _stringify2.default)(mocky.map(function (rule) {
                                return rule.path;
                            }));

                            (0, _server.hookBodyHandler)((0, _util.injectScripts)(['window.mockPaths = ' + mockPaths + ';window.mtopEnv = \'' + (mtopEnv || "m") + '\';', '(' + _mockMtop2.default.toString() + ')()']));
                        }
                        //替换页面资源的domain
                        domainy && (0, _server.hookBodyHandler)((0, _util.replaceDomain)(domainy, ip));

                        CDP = null;

                        if (debug) {
                            // 开启调试server
                            CDP = (0, _anydebugger2.default)(debugPort, debuglog);
                            // 插入调试代码
                            (0, _server.hookBodyHandler)((0, _util.injectScripts)(['//' + ip + ':' + debugPort + '/static/js/anydebugger.js', 'window.addEventListener(\'error\', function (event) {console.log(event.message+" at "+event.filename);});window.addEventListener(\'unhandledrejection\', function (event) {console.log(\'unhandledrejection: \'+event.reason);});']));
                            log.info('debug server start successfully at ' + newdomain + ':' + debugPort + ' !');
                        }
                        // 执行配置的命令，注意是当前server进程的子线程运行，输出会混入到server输出
                        (0, _shell.runCmds)(cmds);
                        //启动服务
                        try {
                            (0, _server.createServer)(oport, CDP);
                        } catch (e) {
                            log.debug("error: ", e);
                        }
                        log.info('server start successfully at ' + newdomain + ':' + oport + ' !');
                        spinner.stop(true);
                        (0, _shell.getLink)(newdomain + ':' + oport, urlsuffix).then(function (url) {
                            log.warn('you can visit you project at ' + url + ' !');
                            // url && bopen(url);
                            if (debug) {
                                (0, _bopen2.default)('http://' + newdomain + ':' + debugPort + '?simulator=' + simulator + '&url=' + url);
                            }
                        });

                    case 19:
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
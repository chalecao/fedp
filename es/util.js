'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.injectScripts = undefined;
exports.applyDomain = applyDomain;
exports.makeSpinner = makeSpinner;
exports.handleZebra = handleZebra;
exports.getIPAdress = getIPAdress;

var _domain = require('@ali/tbdomain/domain');

var _domain2 = _interopRequireDefault(_domain);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _cliSpinner = require('cli-spinner');

var _cliSpinner2 = _interopRequireDefault(_cliSpinner);

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

function handleZebra(options) {
    var isCDN = false;
    if (options.url.indexOf('/cdn') === 0) {
        options.url = options.url.slice(4);
        isCDN = true;
    }
    options.headers.host = isCDN ? 'g.alicdn.com' : 'test.tmall.com';
    var port = isCDN ? 8000 : 3000;

    options.uri = _url2.default.parse(options.url);
    options.uri.hostname = "127.0.0.1";
    options.uri.port = port;
    options.uri.protocol = 'http:';
    options.uri = _url2.default.format(options.uri);

    return options;
}

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
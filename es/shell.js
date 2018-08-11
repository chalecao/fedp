'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.runCmds = runCmds;
exports.getLink = getLink;

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function runCmds(cmds) {
    if (Array.isArray(cmds)) {
        cmds.forEach(function (cmd) {
            _shelljs2.default.exec(cmd, { async: true });
        });
    } else {
        _shelljs2.default.exec(cmds, { async: true });
    }
}

function getLink(host) {
    return new _promise2.default(function (resolve, reject) {
        _shelljs2.default.exec('git remote -v', { silent: true }, function (code, stdout, stderr) {
            if (/:(.*?)\.git/i.test(stdout)) {
                var path = RegExp.$1.replace('/', '-');
                var name = /mui-/.test(path) ? 'mobile' : 'index';
                var url = 'http://' + host + '/' + path + '/' + name;
                resolve(url);
            } else {
                reject('failed');
            }
        });
    });
}
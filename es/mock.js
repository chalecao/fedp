"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

exports.default = mockJs;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * hack mtop request, add handleRequestWillBeSent handleDataReceived for debug
 */
function mockJs() {
    function matchInterface(arr, url) {
        return arr.find(function (item) {
            if (new RegExp(item).exec(url)) {
                return true;
            }
        });
    }
    function requestData(url) {
        return new _promise2.default(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url, true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    resolve(xmlhttp.responseText);
                }
            };
        });
    }
    function mockreq() {
        var _mtopreq = window.lib.mtop.request;
        var headers = { 'Content-Type': 'application/json;charset=UTF-8' };
        window.lib.mtop.request = function (args) {
            var reqid = window.handleRequestWillBeSent && handleRequestWillBeSent({
                cookie: document.cookie,
                'Content-Type': 'application/json;charset=UTF-8'
            }, args.api, args.type, args.data);
            if (window.mockPaths && matchInterface(mockPaths, args.api)) {
                return new _promise2.default(function (resolve, reject) {
                    requestData("/api/" + args.api).then(function (res) {
                        window.handleResponseReceived && handleResponseReceived(reqid, headers, args.api, res);
                        resolve(res);
                    }, function (err) {
                        window.handleResponseReceived && handleResponseReceived(reqid, headers, args.api, err);
                        reject(res);
                    });
                });
            } else {
                return _mtopreq.call(window.lib.mtop, args).then(function (res) {
                    window.handleResponseReceived && handleResponseReceived(reqid, headers, args.api, res);
                    return res;
                }, function (err) {
                    window.handleResponseReceived && handleResponseReceived(reqid, headers, args.api, err);
                    return _promise2.default.reject(err);
                });
            }
        };
    }

    function start() {
        if (window.lib && window.lib.mtop) {
            mockreq();
        } else {
            requestAnimationFrame(start);
        }
    }

    start();
}
module.exports = exports["default"];
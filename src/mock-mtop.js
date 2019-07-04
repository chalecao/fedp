module.exports = function mockJs() {
    function matchInterface(arr, url) {
        return arr.find(function (item) {
            if (new RegExp(item).exec(url)) {
                return true;
            }
        });
    }
    function mockreq() {
        var _mtopreq = window.lib.mtop.H5Request;
        var headers = { 'Content-Type': 'application/json;charset=UTF-8' };
        window.lib.mtop.request = window.lib.mtop.H5Request = function (args) {
            var reqid = window.handleRequestWillBeSent && handleRequestWillBeSent({
                cookie: document.cookie,
                'Content-Type': 'application/json;charset=UTF-8'
            }, args.api, args.type, args.data);
            if (window.mockPaths && matchInterface(mockPaths, args.api)) {
                lib.mtop.config.prefix = '';
                lib.mtop.config.subDomain = '';
                lib.mtop.config.mainDomain = location.host;
            } else {
                lib.mtop.config.prefix = 'h5api';
                lib.mtop.config.subDomain = window.mtopEnv || "m";
                lib.mtop.config.mainDomain = 'tmall.com'
            }
            return _mtopreq.call(window.lib.mtop, args).then(function (res) {
                window.handleResponseReceived && handleResponseReceived(reqid, headers, args.api, res);
                return res;
            }, function (err) {
                window.handleResponseReceived && handleResponseReceived(reqid, headers, args.api, err);
                return Promise.reject(err);
            })
        }
    }

    function start() {
        if (window.lib && window.lib.mtop) {
            mockreq()
        } else {
            requestAnimationFrame(start)
        }
    }
    start()
}
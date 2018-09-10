/**
 * hack mtop request, add handleRequestWillBeSent handleDataReceived for debug
 */
module.exports = function mockJs() {
    function matchInterface(arr, url) {
        return arr.find(function (item) {
            if (new RegExp(item).exec(url)) {
                return true;
            }
        });
    }
    function requestData(url) {
        return new Promise(function (resolve, reject) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", url, true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.send();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    resolve(xmlhttp.responseText)
                }
            }
        })
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
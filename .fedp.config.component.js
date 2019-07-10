/**
 * fedp配置文件
 */

const targetMockServer = 'https://127.0.0.1/';

module.exports = {
    port: 8889,               // proxy server port
    domain: false, // true to apply new domain, false to use ip, or you self domain string like "test.tmall.com"
    debug: true,              // enable debug
    mock: false,               // enable debug
    urlsuffix: 'mobile',
    env: "", // pre预发，prod线上，daily日常，对应于mtop不同请求
    debugPort: 9000,          // debug server port
    cmds: [                   // cmds you want run 
        // "tap server"      
    ],
    scripts: [                // scripts you want to inject to the html 
    ],
    // simulator: "//irma.work.ucweb.local/#/remote/remote-control-devices",   // web simulator url
    // simulator: "//mds.alibaba-inc.com/device/93c29bb90005",   // web simulator url, 需要填写云真机的url
    domainy: [{                     // proxy domain config, if not for remote debug, no need to config
        path: "g-assets.daily.taobao.net/",
        data: "__ip__:8889/"
    }],
    proxy: {
        host: [{              // proxy requestoption host config
            path: "\\?\\?",
            data: "g-assets.daily.taobao.net"
        }, {
            path: ".*",
            data: "test.tmall.com"
        }],
        hostname: [{          // proxy requestoption hostname config
            path: "\\?\\?",
            data: "g-assets.daily.taobao.net"
        }, {
            path: ".*",
            data: "127.0.0.1"
        }],
        port: [{              // proxy requestoption port config
            path: "\\?\\?",
            data: 8000
        }, {              // proxy requestoption port config
            path: "css",
            data: 8000
        }, {
            path: ".*",
            data: 3000
        }]
    },
    mocky: [{
        path: "getBrandWelfare",
        // data: require("./demo/getBrandWelfare.json")
    }, {
        path: "getBrandGoods",
        data: { msg: "ok" }
    }, {
        path: "apiOnMockServer",
        routeTo: targetMockServer
    }]
}
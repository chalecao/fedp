/**
 * fedp配置文件
 */

const targetMockServer = 'https://127.0.0.1/';

module.exports = {
    port: 8889,               // proxy server port
    domain: false, // true to apply new domain, false to use ip, or you self domain string like "test.tmall.com"
    debug: false,              // enable debug
    mock: true,               // enable mock
    env: "", // pre预发，prod线上，daily日常，对应于mtop不同请求
    debugPort: 9001,          // debug server port
    cmds: [                   // cmds you want run
        // "tap server"
    ],
    scripts: [                // scripts you want to inject to the html
    ],
    // urlsuffix: "src/indexWeb.html#POSMarketingIndex",
    // simulator: "//irma.work.ucweb.local/#/remote/remote-control-devices",   // web simulator url
    // simulator: "//mds.alibaba-inc.com/device/93c29bb90005",   // web simulator url, 需要填写云真机的url
    // domainy: [{                     // proxy domain config, if not for remote debug, no need to config,
    //     path: "g-assets.daily.taobao.net",
    //     data: "__ip__:8889"
    // }],
    proxy: {
        host: [{              // proxy requestoption host config
            path: ".(js|css)",
            data: "127.0.0.1"
        }, {
            path: ".*",
            data: "localhost"
        }],
        hostname: [{              // proxy requestoption host config
            path: ".(js|css)",
            data: "127.0.0.1"
        }, {          // proxy requestoption hostname config
            path: ".*",
            data: "localhost"
        }],
        port: [{              // proxy requestoption port config
            path: ".*",
            data: 9000
        }]
    },
    mocky: [{
        path: "queryList",
        data: { status: 200, msg: "ok" }
    }, {
        path: "create",
        data: "./data/create.js"
    }, {
        path: "mockServer",
        routeTo: targetMockServer
    }]
}

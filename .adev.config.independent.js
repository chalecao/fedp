/**
 * adev配置文件，详情：https://www.atatech.org/articles/135865
 */

const targetMockServer = 'https://127.0.0.1/';

module.exports = {
    port: 8889,               // proxy server port
    domain: false, // true to apply new domain, false to use ip, or you self domain string like "test.tmall.com"
    debug: true,              // enable debug
    mock: false,               // enable mock
    env: "", // pre预发，prod线上，daily日常，对应于mtop不同请求
    debugPort: 9000,          // debug server port
    cmds: [                   // cmds you want run 
        // "tap server"      
    ],
    scripts: [                // scripts you want to inject to the html 
    ],
    // urlsuffix: encodeURIComponent("wow/ceshi/act/hurongwebbased"),
    // simulator: "//irma.work.ucweb.local/#/remote/remote-control-devices",   // web simulator url
    // simulator: "//mds.alibaba-inc.com/device/93c29bb90005",   // web simulator url, 需要填写云真机的url
    domainy: [{                     // proxy domain config, if not for remote debug, no need to config, 
        path: "g-assets.daily.taobao.net",
        data: "__ip__:8889"
    }],
    proxy: {
        host: [{              // proxy requestoption host config
            path: ".(js|css)",
            data: "g-assets.daily.taobao.net"
        }, {
            path: ".*",
            data: "pre-wormhole.tmall.com"
        }],
        hostname: [{              // proxy requestoption host config
            path: ".(js|css)",
            data: "g-assets.daily.taobao.net"
        }, {          // proxy requestoption hostname config
            path: ".*",
            data: "pre-wormhole.tmall.com"
        }],
        port: [{              // proxy requestoption port config
            path: ".*",
            data: 80
        }]
    },
    mocky: [{
        path: "getBrandWelfare",
        data: "./demo/getBrandWelfare.json"
    }, {
        path: "apiOnMockServer",
        routeTo: targetMockServer
    }]
}
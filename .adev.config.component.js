/**
 * 斑马模块开发配置
 * domainy: 域名重写规则，主要用于远程调试，如果是本地有host配置，则不用设置该配置项
 * proxy: 资源和端口映射规则
 * mocky: 数据mock配置
 */

const targetMockServer = 'https://127.0.0.1/';

module.exports = {
    port: 8889,               // proxy server port
    domain: false, // true to apply new domain, false to use ip, or you self domain string like "test.tmall.com"
    debug: true,              // enable debug
    mock: false,               // enable debug
    debugPort: 9000,          // debug server port
    cmds: [                   // cmds you want run 
        // "tap server"      
    ],
    scripts: [                // scripts you want to inject to the html 
    ],
    simulator: "//irma.work.ucweb.local/#/remote/remote-control-devices",   // web simulator url
    domainy: [{                     // proxy domain config, if not for remote debug, no need to config
        path: "g-assets.daily.taobao.net/\\?\\?",
        data: "__ip__:8889/??"
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
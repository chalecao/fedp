/**
 * 独立使用配置，本例子是代理到斑马预发环境
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
    urlsuffix: encodeURIComponent("wow/ceshi/act/hurongwebbased"),
    simulator: "//irma.work.ucweb.local/#/remote/remote-control-devices",   // web simulator url
    // simulator: "//mds.alibaba-inc.com/device/93c29bb90005",   // web simulator url, 需要填写云真机的url
    domainy: [{                     // proxy domain config, if not for remote debug, no need to config
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
        // data: require("./demo/getBrandWelfare.json")
    }, {
        path: "apiOnMockServer",
        routeTo: targetMockServer
    }]
}
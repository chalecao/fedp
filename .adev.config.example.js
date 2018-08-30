/**
 * 独立使用配置，本例子是代理到斑马预发环境
 * domainy: 域名重写规则，主要用于远程调试，如果是本地有host配置，则不用设置该配置项，其中path参数用于匹配url，data是对应替换值，__ip__会被替换成本地ip
 * proxy: 资源和端口映射规则，其中path参数用于匹配url，data是设置参数
 * mocky: 数据mock配置，需要设置mock:true 才生效，其中path参数用于匹配url，data是返回的数据，目前支持mtop的请求mock
 */

// var data = require("./data.json")
const targetMockServer = 'https://127.0.0.1/';

module.exports = {
    port: 8889,               // proxy server port
    domain: false, // true to apply new domain, false to use ip, or you self domain string string like "test.tmall.com"
    debug: true,              // enable debug
    mock: true,               // enable debug
    debugPort: 9000,          // debug server port
    cmds: [                   // cmds you want run 
        // "tap server"      
    ],
    scripts: [                // scripts you want to inject to the html 
    ],
    simulator: "//irma.work.ucweb.local/#/remote/remote-control-devices",   // web simulator url
   // simulator: "//mds.alibaba-inc.com/device/93c29bb90005",   // web simulator url, 需要填写云真机的url
    domainy: [{                     // proxy domain config, if not for remote debug, no need to config
        path: "g.alicdn.com/\\?\\?",
        data: "__ip__:8889/??"
    }],
    proxy: {
        host: [{              // proxy host config
            path: "/cdn",
            data: "g.alicdn.com"
        }, {
            path: ".*",
            data: "test.tmall.com"
        }],
        hostname: [{          // proxy hostname config
            path: ".*",
            data: "127.0.0.1"
        }],
        port: [{              // proxy port config
            path: "/cdn",
            data: 8000
        }, {
            path: ".*",
            data: 3000
        }]
    },
    mocky: [{                // mock hostname config
        path: "timeline.get",
        data: { msg: "true" }
        // }, {
        //     path: "data.get",
        //     data: data
    }, {
        path: "api",
        routeTo: targetMockServer

    }]
}
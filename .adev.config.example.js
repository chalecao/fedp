/**
 * adev config file, be free to modify
 * proxy: proxy rule
 * mocky: mock rule
 */

// var data = require("./data.json")
const targetMockServer = 'https://127.0.0.1/';

module.exports = {
    port: 8889,               // proxy server port
    domain: "test.tmall.com", // true to apply new domain, false to use ip, or you self domain
    debug: true,              // enable debug
    mock: true,               // enable debug
    debugPort: 9000,          // debug server port
    cmds: [                   // cmds you want run 
        // "tap server"      
    ],
    scripts: [                // scripts you want to inject to the html 
    ],
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
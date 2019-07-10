/**
 * fedp配置文件
 */
module.exports = {
    domain: false,// 可以指定mock server绑定的域名，默认是绑定到ip 
    port: 8889,   // 本地mock server服务端口
    debug: false, // 是否开启CDP调试功能，本地开发不用开启
    debugPort: 9000, // CDP调试端口，本地开发不用配置
    mock: true,   // 接口mock开关，默认开启
    mtopEnv: "m", // 默认的mtop请求配置，可以不用配置，可选值 wapa:预发，m:线上，waptest:日常，
    cmds: [
        // "tap server"  // 每次启动本地server时调用的脚本，可以配置项目启动脚本，也可以单独启动项目
    ],
    scripts: [],  // 自定义插入页面的脚本，支持js片段，文件URL地址
    domainy: [{   // 域名重写规则，主要用于远程调试，如果是本地有host配置，则不用设置该配置项，其中path参数用于匹配url，data是对应替换值，__ip__会被替换成本地ip
        path: "//g.alicdn.com",
        data: "//__ip__:8889"
    }],
    proxy: {      // 资源和端口映射规则，其中path参数用于匹配url，data是设置参数，用于处理mock server接收到的请求
        host: [{
            path: new RegExp("(\\.js|\\.css)"),
            data: "g.alicdn.com"
        }, {
            path: new RegExp(".*"),
            data: "test.tmall.com"
        }],
        hostname: [{
            path: new RegExp(".*"),
            data: "127.0.0.1"
        }],
        port: [{
            path: new RegExp("(\\.js|\\.css)"),
            data: 8000
        }, {
            path: new RegExp(".*"),
            data: 3000
        }]
    },
    mocky: [{
        //     path: "relationrecommend",
        //     routeTo: "http://h5api.wapa.tmall.com" // 这个接口映射到预发环境接口
        // }, {
        //     path: "easyhome",
        //     routeTo: "http://h5api.waptest.tmall.com", // 这个接口映射到日常环境接口
        //     cookie: "custom cookie"  // 支持自定义cookie，不需要可以不用配置
        // }, {
        //     path: "guideExtConfig",
        //     data: "./demo/config.js" // 支持本地js模块导出数据，支持动态化数据格式，动态加载数据
        // }, {
        //     path: "batchQuery",
        //     data: "./demo/shops.json" // 支持JSON数据，动态加载
        // }, {
        //     path: "coupon",           // 支持直接定义数据内容
        //     data: {
        //         "api": "xxx.xxxx.xxx",
        //         "data": { restult: 1 },
        //         "ret": [
        //             "SUCCESS::接口调用成功"
        //         ],
        //         "v": "1.0"
        //     }
    }]
}
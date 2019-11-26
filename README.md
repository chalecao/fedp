## fedp
fedp = a front end dev proxy tool for you which makes you happier in coding. with config file you specified, you can config the proxy rule and mock data rule in you project or anywhere.

no sideEffect, easy to use, just an config file add to you project.
## usage

```
npm install fedp -g

fedp init


fedp -c config.js
```

## debug
debug是基于anydebugger项目支持，anydebugger：https://github.com/chalecao/anydebugger
```
module.exports = {
    port: 8889,               // proxy server port
    domain: false, // true to apply new domain, false to use ip, or you self domain string like "test.tmall.com"
    debug: true,              // enable debug
    mock: true,               // enable mock
    env: "", // pre预发，prod线上，daily日常，对应于mtop不同请求
    debugPort: 9001,          // debug server port
    cmds: [                   // cmds you want run
        // "tap server"
    ],
    scripts: [                // scripts you want to inject to the html
    ],

```
设置debug和debugPort即可

## LICENCE
MIT

var data = require("./data.json")

const targetPage = 'http://127.0.0.1:3000/';
const targetMtop = 'https://106.11.52.96/';
const targetStatic = 'http://127.0.0.1:8000';

module.exports = {
    port: 8889,
    domain: "test.tmall.com",
    debug: true,
    mock: true,
    debugPort: 9000,
    cmds: [
        "tap server"
    ],
    scripts: [
    ],
    proxy: [{
        "path": "mtop",
        "routeTo": targetMtop
    }, {
        "path": "mtop.tmall.supermarket.city.timeline.get",
        "data": JSON.stringify(data)
    }, {
        "path": "mtop.tmall.supermarket.city.timeline.get",
        "data": { msg: "true" }
    }]
}
import { injectScripts, makeSpinner, handleReq, getIPAdress, replaceDomain, forceRequire } from './util'
import { createServer, hookBodyHandler, hookHeadHandler, hookRequestHandler, hookInterfaceHandler } from './server'
import logger from "./logger"
//mockMtop hack mtop request, add handleRequestWillBeSent handleDataReceived for chrome debug，wapa:预发，m:线上，waptest:日常
import mockMtop from "./mock-mtop"
import { runCmds, getLink } from './shell'
import bopen from 'bopen'
import createDebugger from "anydebugger"
const log = logger("main");

export default async function createApp(pp, config) {
    let spinner = makeSpinner('start wrapper ...');

    let { scripts, proxy, cmds, debug, mock, debugPort, domain, mtopEnv, mocky, domainy, simulator, urlsuffix, debuglog, port } = forceRequire(config);

    let ip = getIPAdress();
    let newdomain = ip;
    if (typeof domain == "string") {
        newdomain = domain;
    }
    log.info(`start ...`)
    log.info(`domain: ${newdomain}, ip: ${ip}`)
    let oport = pp || port;
    //注入处理函数
    hookRequestHandler(handleReq(proxy));
    hookBodyHandler(injectScripts(scripts));
    if (mock) {
        //配置接口mock规则，在接口请求时会按这个规则匹配
        hookInterfaceHandler(mocky);
        // 提取出接口mock规则的路径，注入页面的mtop hack脚本会匹配路径，匹配到了请求本地，否则走默认mtop请求
        let mockPaths = JSON.stringify(mocky.map(rule => rule.path));
        hookBodyHandler(injectScripts([`window.mockPaths = ${mockPaths};window.mtopEnv = '${mtopEnv || "m"}';`, `(${mockMtop.toString()})()`]));
    }
    //替换页面资源的domain
    domainy && hookBodyHandler(replaceDomain(domainy, ip));

    let CDP = null;
    if (debug) {
        // 开启调试server
        CDP = createDebugger(debugPort, debuglog)
        // 插入调试代码
        hookBodyHandler(injectScripts([`//${ip}:${debugPort}/static/js/anydebugger.js`, `window.addEventListener('error', function (event) {console.log(event.message+" at "+event.filename);});window.addEventListener('unhandledrejection', function (event) {console.log('unhandledrejection: '+event.reason);});`]));
        log.info(`debug server start successfully at ${newdomain}:${debugPort} !`);
    }
    // 执行配置的命令，注意是当前server进程的子线程运行，输出会混入到server输出
    runCmds(cmds);
    //启动服务
    try {
        createServer(oport, CDP);
    } catch (e) {
        log.debug("error: ", e)
    }
    log.info(`server start successfully at ${newdomain}:${oport} !`);
    spinner.stop(true);
    getLink(`${newdomain}:${oport}`, urlsuffix).then(url => {
        log.warn(`you can visit you project at ${url} !`);
        // url && bopen(url);
        if (debug) {
            bopen(`http://${newdomain}:${debugPort}?simulator=${simulator}&url=${url}`);
        }
    });

}

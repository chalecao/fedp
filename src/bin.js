#!/usr/bin/env node
import { parse, get, args } from "opts";
import { resolve } from "path";
import pjson from "../package.json";
import createApp from "./main";
import { writeFile } from "./util";
import fs from 'fs';
import List from 'prompt-list';
const version = pjson.version

parse([{
    short: "v",
    long: "version",
    description: "Show the version.",
    required: false,
    callback: function () {
        console.log(version);
        return process.exit(1);
    }
}, {
    short: "p",
    long: "port",
    description: "Specify the port.",
    value: true,
    required: false
}, {
    short: "c",
    long: "config",
    description: "Specify the config file, read ./.anywapper.config.js as default.",
    value: true,
    required: false
}].reverse(), true);

var arg1 = args()[0];
let port = get('port');
let configfile = get('config');


function createConfig() {
    var list = new List({
        name: '开发场景',
        message: '你处于那种开发场景?',
        // choices may be defined as an array or a function that returns an array
        choices: [
            '源码页面开发',
            '斑马模块开发',
            '独立项目'
        ]
    });
    list.run().then(function (answer) {
        let fileName = ".adev.config.independent.js"
        switch (answer) {
            case '斑马模块开发': fileName = ".adev.config.component.js"; break;
            case '源码页面开发': fileName = ".adev.config.source.js"; break;
            case '独立项目': fileName = ".adev.config.independent.js"; break;
        }
        writeFile(resolve(__dirname, "../" + fileName), resolve(process.cwd(), "adev.config.js"))
    });
}

if (arg1 == "init") {
    createConfig()
} else {
    if (!configfile && !fs.existsSync(resolve(process.cwd(), "adev.config.js"))) {
        createConfig()
    } else {
        let configFilePath = resolve(configfile || "adev.config.js");
        createApp(port, configFilePath)
    }
}


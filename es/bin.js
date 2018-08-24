#!/usr/bin/env node
"use strict";

var _opts = require("opts");

var _path = require("path");

var _package = require("../package.json");

var _package2 = _interopRequireDefault(_package);

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

var _util = require("./util");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _promptList = require("prompt-list");

var _promptList2 = _interopRequireDefault(_promptList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = _package2.default.version;

(0, _opts.parse)([{
    short: "v",
    long: "version",
    description: "Show the version.",
    required: false,
    callback: function callback() {
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

var arg1 = (0, _opts.args)()[0];

if (arg1 == "init") {

    var list = new _promptList2.default({
        name: 'Select Scene',
        message: 'Which Scene you want to use?',
        // choices may be defined as an array or a function that returns an array
        choices: ['zebra-component', 'zebra-sourcecode', 'independent']
    });
    list.run().then(function (answer) {
        var fileName = ".adev.config.example.js";
        switch (answer) {
            case 'zebra-component':
                fileName = ".adev.config.component.js";break;
            case 'zebra-sourcecode':
                fileName = ".adev.config.code.js";break;
            case 'independent':
                fileName = ".adev.config.independent.js";break;
        }
        (0, _util.writeFile)((0, _path.resolve)(__dirname, "../" + fileName), (0, _path.resolve)(process.cwd(), "adev.config.js"));
    });
} else {
    var port = (0, _opts.get)('port');
    var configfile = (0, _opts.get)('config');
    if (!configfile && !_fs2.default.existsSync((0, _path.resolve)(process.cwd(), "adev.config.js"))) {
        (0, _util.writeFile)((0, _path.resolve)(__dirname, "../.adev.config.example.js"), (0, _path.resolve)(process.cwd(), "adev.config.js"));
    }
    var configFilePath = (0, _path.resolve)(configfile || "adev.config.js");
    (0, _main2.default)(port, require(configFilePath));
}
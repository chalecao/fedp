#!/usr/bin/env node
"use strict";

var _opts = require("opts");

var _path = require("path");

var _package = require("../package.json");

var _package2 = _interopRequireDefault(_package);

var _main = require("./main");

var _main2 = _interopRequireDefault(_main);

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

var port = (0, _opts.get)('port');
var configfile = (0, _opts.get)('config');

var configFilePath = (0, _path.resolve)(configfile || "./.anywapper.config.js");

(0, _main2.default)(port, require(configFilePath));
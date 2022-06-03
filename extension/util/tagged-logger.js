"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaggedLogger = void 0;
const nodecg_1 = require("./nodecg");
class TaggedLogger {
    constructor(tag) {
        this.tag = tag;
    }
    log(level, ...msg) {
        (0, nodecg_1.get)().log[level](`[${this.tag}]`, ...msg);
    }
    trace(...msg) {
        this.log('trace', ...msg);
    }
    debug(...msg) {
        this.log('debug', ...msg);
    }
    info(...msg) {
        this.log('info', ...msg);
    }
    warn(...msg) {
        this.log('warn', ...msg);
    }
    error(...msg) {
        this.log('error', ...msg);
    }
}
exports.TaggedLogger = TaggedLogger;

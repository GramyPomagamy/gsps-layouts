'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const events = __importStar(require("events"));
// Packages
const parse_ms_1 = __importDefault(require("parse-ms"));
const milliseconds_1 = __importDefault(require("milliseconds"));
const TimeUtils = {
    /**
     * Constructs a new TimeStruct with the provided number of milliseconds.
     * @param {Number} [milliseconds = 0] - The value to instantiate this TimeObject with, in milliseconds.
     * @returns {TimeStruct} - A populated TimeStruct object.
     */
    createTimeStruct(ms = 0) {
        const parsedTime = TimeUtils.parseMs(ms);
        return Object.assign({}, parsedTime, {
            formatted: TimeUtils.formatMilliseconds(ms),
            raw: ms,
            timestamp: Date.now(),
        });
    },
    /**
     * Formats a number of milliseconds into a string ([hh:]mm:ss).
     * @param {number} inputMs - The number of milliseconds to format.
     * @returns {string} - The formatted time sting.
     */
    formatMilliseconds(inputMs) {
        let str = '';
        if (inputMs < 0) {
            str += '-';
            inputMs = -inputMs;
        }
        const { days, hours, minutes, seconds, milliseconds } = TimeUtils.parseMs(inputMs);
        if (days) {
            str += `${days}d `;
        }
        if (hours) {
            str += `${hours}:`;
        }
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');
        str += `${paddedMinutes}:${paddedSeconds}`;
        return str;
    },
    /**
     * Parses a number of milliseconds into a ParsedTime object.
     * @param {number} milliseconds - A number of milliseconds.
     * @returns {ParsedTime} - An object representing each dimension of the time.
     */
    parseMs(milliseconds) {
        return (0, parse_ms_1.default)(milliseconds);
    },
    /**
     * Parses a number of seconds into a ParsedTime object.
     * @param {number} seconds - A number of seconds.
     * @returns {ParsedTime} - An object representing each dimension of the time.
     */
    parseSeconds(seconds) {
        return TimeUtils.parseMs(seconds * 1000);
    },
    /**
     * Parses a formatted time string into an integer of milliseconds.
     * @param {string} timeString - The formatted time string to parse.
     * Accepts the following: hh:mm:ss.sss, hh:mm:ss, hh:mm, hh
     * @returns {number} - The parsed time string represented as milliseconds.
     */
    parseTimeString(timeString) {
        let ms = 0;
        const timeParts = timeString.split(':').filter((part) => part.trim());
        if (timeParts.length === 3) {
            ms += milliseconds_1.default.hours(parseInt(timeParts[0], 10));
            ms += milliseconds_1.default.minutes(parseInt(timeParts[1], 10));
            ms += milliseconds_1.default.seconds(parseFloat(timeParts[2]));
            return ms;
        }
        if (timeParts.length === 2) {
            ms += milliseconds_1.default.minutes(parseInt(timeParts[0], 10));
            ms += milliseconds_1.default.seconds(parseFloat(timeParts[1]));
            return ms;
        }
        if (timeParts.length === 1) {
            ms += milliseconds_1.default.seconds(parseFloat(timeParts[0]));
            return ms;
        }
        throw new Error(`Unexpected format of timeString argument: ${timeString}`);
    },
    /**
     * A timer which counts down to a specified end time.
     */
    CountdownTimer: class CountdownTimer extends events.EventEmitter {
        constructor(endTime, { tickRate = 100 } = {}) {
            if (typeof endTime !== 'number') {
                throw new Error('endTime must be defined and it must be a number');
            }
            super();
            this._interval = setInterval(() => {
                const currentTime = Date.now();
                const timeRemaining = Math.max(endTime - currentTime, 0);
                this.emit('tick', TimeUtils.createTimeStruct(timeRemaining));
                if (timeRemaining <= 0) {
                    this.emit('done');
                }
            }, tickRate);
        }
        stop() {
            clearInterval(this._interval);
        }
    },
    /**
     * A timer which counts up, with no specified end time.
     */
    CountupTimer: class CountupTimer extends events.EventEmitter {
        constructor({ tickRate = 100, offset = 0 } = {}) {
            super();
            const startTime = Date.now() - offset;
            this._interval = setInterval(() => {
                const currentTime = Date.now();
                const timeElapsed = currentTime - startTime;
                this.emit('tick', TimeUtils.createTimeStruct(timeElapsed));
                if (timeElapsed <= 0) {
                    this.emit('done');
                }
            }, tickRate);
        }
        stop() {
            clearInterval(this._interval);
        }
    },
    /**
     * A timer which counts down, even after meeting the target end time.
     */
    InfiniteCountdownTimer: class InfiniteCountdownTimer extends events.EventEmitter {
        constructor(endTime, { tickRate = 100 } = {}) {
            if (typeof endTime !== 'number') {
                throw new Error('endTime must be defined and it must be a number');
            }
            super();
            this._interval = setInterval(() => {
                const currentTime = Date.now();
                const timeRemaining = endTime - currentTime;
                this.emit('tick', TimeUtils.createTimeStruct(timeRemaining));
            }, tickRate);
        }
        stop() {
            clearInterval(this._interval);
            this.emit('done');
        }
    },
};
exports.default = TimeUtils;

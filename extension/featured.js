"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const needle_1 = __importDefault(require("needle"));
const nodecg_1 = require("./util/nodecg");
const tagged_logger_1 = require("./util/tagged-logger");
const featuredLog = new tagged_logger_1.TaggedLogger('featured');
const config = (0, nodecg_1.get)().bundleConfig.twitchExt;
function updateFeatured(players) {
    return __awaiter(this, void 0, void 0, function* () {
        const channels = players.join(',');
        try {
            const resp = yield (0, needle_1.default)('get', `https://api.furious.pro/featuredchannels/bot/${config.token}/${encodeURIComponent(channels)}`);
            if (resp.statusCode === 200) {
                featuredLog.info(`Pomyślnie zaktualizowano panel z runnerami pod streamem z kanałami ${channels}`);
            }
            else {
                throw new Error(`Status Code ${resp.statusCode}`);
            }
        }
        catch (err) {
            featuredLog.warn('Błąd przy aktualizowaniu panelu z runnerami pod streamem: ', err);
        }
    });
}
(0, nodecg_1.get)().listenFor('repeaterFeaturedChannels', 'nodecg-speedcontrol', (names) => {
    if (config.enabled) {
        updateFeatured(names);
    }
});

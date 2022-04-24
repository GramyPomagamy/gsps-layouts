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
exports.updatePrizes = void 0;
const needle_1 = __importDefault(require("needle"));
const replicants_1 = require("./util/replicants");
const nodecg_1 = require("./util/nodecg");
const donations_1 = require("./donations");
const tagged_logger_1 = require("./util/tagged-logger");
const refreshTime = 60 * 1000; // Odśwież nagrody co 60s.
const config = (0, nodecg_1.get)().bundleConfig.tracker;
const rootURL = config.rootURL;
const prizesLog = new tagged_logger_1.TaggedLogger('nagrody');
function processRawPrizes(rawPrizes) {
    return Array.from(rawPrizes)
        .filter((prize) => prize.fields.state === 'ACCEPTED')
        .map((prize) => {
        const startTime = prize.fields.startrun__starttime || prize.fields.starttime;
        const endTime = prize.fields.endrun__endtime || prize.fields.endtime;
        return {
            id: prize.pk,
            name: prize.fields.name,
            provided: prize.fields.provider || undefined,
            minimumBid: parseFloat(prize.fields.minimumbid),
            image: prize.fields.image || undefined,
            startTime: startTime ? Date.parse(startTime) : undefined,
            endTime: endTime ? Date.parse(endTime) : undefined,
        };
    });
}
function updatePrizes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const resp = yield (0, needle_1.default)('get', `${rootURL}/search?event=${config.eventID}&type=prize`, {
                cookies: (0, donations_1.getCookies)(),
            });
            const currentPrizes = processRawPrizes(resp.body);
            replicants_1.prizesReplicant.value = currentPrizes;
        }
        catch (err) {
            prizesLog.warn('Błąd przy otrzymywaniu nagród:', err);
            replicants_1.prizesReplicant.value.length = 0; // Wyczyść dane na wszelki wypadek
        }
        setTimeout(updatePrizes, refreshTime);
    });
}
exports.updatePrizes = updatePrizes;

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
const nodecg_1 = require("./util/nodecg");
const needle_1 = __importDefault(require("needle"));
const replicants_1 = require("./util/replicants");
const tagged_logger_1 = require("./util/tagged-logger");
const URL = (0, nodecg_1.get)().bundleConfig.milestonesUrl;
const log = new tagged_logger_1.TaggedLogger('milestones');
let refreshTimeout;
function updateMilestones() {
    return __awaiter(this, void 0, void 0, function* () {
        (0, nodecg_1.get)().sendMessage('milestones:updating');
        clearTimeout(refreshTimeout);
        try {
            const raw = yield (0, needle_1.default)('get', URL);
            const milestones = processMilestones(raw.body);
            replicants_1.milestonesReplicant.value = milestones;
            (0, nodecg_1.get)().sendMessage('milestones:updated');
            refreshTimeout = setTimeout(updateMilestones, 60 * 1000);
        }
        catch (err) {
            log.error(`Błąd przy pobieraniu milestonów: ${err}`);
        }
    });
}
function processMilestones(milestones) {
    const sorted = milestones
        .sort((a, b) => {
        return a.Kwota - b.Kwota;
    })
        .map((milestone) => ({
        name: milestone.Nazwa,
        amount: milestone.Kwota,
    }));
    return sorted;
}
updateMilestones();
refreshTimeout = setTimeout(updateMilestones, 60 * 1000);
(0, nodecg_1.get)().listenFor('updateMilestones', updateMilestones);

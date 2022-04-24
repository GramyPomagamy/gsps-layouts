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
const tagged_logger_1 = require("./util/tagged-logger");
const log = new tagged_logger_1.TaggedLogger('foobar');
class FoobarControl {
    constructor(address) {
        this.address = address;
    }
    togglePause() {
        (0, needle_1.default)('post', `${this.address}/api/player/pause/toggle`, {}).catch((error) => {
            log.error('Błąd przy (od)pauzowaniu foobara: ' + error.message);
        });
    }
    mute() {
        (0, needle_1.default)('post', `${this.address}/api/player?isMuted=true`, {}).catch((error) => {
            log.error('Błąd przy wyciszaniu foobara: ' + error.message);
        });
    }
    unmute() {
        (0, needle_1.default)('post', `${this.address}/api/player?isMuted=false`, {}).catch((error) => {
            log.error('Błąd przy odciszaniu foobara: ' + error.message);
        });
    }
    getSong() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const playerInfo = yield (0, needle_1.default)('get', `${this.address}/api/player?columns=${encodeURIComponent('%artist%,%title%')}`);
                if (playerInfo.body.player.activeItem.columns[0] &&
                    playerInfo.body.player.activeItem.columns[1]) {
                    return `${playerInfo.body.player.activeItem.columns[0]} - ${playerInfo.body.player.activeItem.columns[1]}`;
                }
                else {
                    return 'Brak piosenki';
                }
            }
            catch (error) {
                log.error('Błąd otrzymywania piosenki: ' + error.message);
                return 'Brak piosenki';
            }
        });
    }
}
exports.default = FoobarControl;

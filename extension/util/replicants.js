"use strict";
/* eslint-disable max-len */
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentEventReplicant = exports.bidsToAcceptReplicant = exports.donationsToAcceptReplicant = exports.prizesReplicant = exports.milestonesReplicant = exports.donationsToReadReplicant = exports.activeRunReplicant = exports.timerReplicant = exports.obsDataReplicant = exports.songReplicant = exports.nameCycleReplicant = exports.autoUpdateTotalReplicant = exports.totalReplicant = void 0;
const nodecg_1 = require("./nodecg");
/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */
exports.totalReplicant = (0, nodecg_1.get)().Replicant('total');
exports.autoUpdateTotalReplicant = (0, nodecg_1.get)().Replicant('autoUpdateTotal');
exports.nameCycleReplicant = (0, nodecg_1.get)().Replicant('nameCycle');
exports.songReplicant = (0, nodecg_1.get)().Replicant('song');
exports.obsDataReplicant = (0, nodecg_1.get)().Replicant('obsData', {
    persistent: false,
});
exports.timerReplicant = (0, nodecg_1.get)().Replicant('timer', 'nodecg-speedcontrol');
exports.activeRunReplicant = (0, nodecg_1.get)().Replicant('runDataActiveRun', 'nodecg-speedcontrol');
exports.donationsToReadReplicant = (0, nodecg_1.get)().Replicant('donationsToRead');
exports.milestonesReplicant = (0, nodecg_1.get)().Replicant('milestones');
exports.prizesReplicant = (0, nodecg_1.get)().Replicant('prizes');
exports.donationsToAcceptReplicant = (0, nodecg_1.get)().Replicant('donationsToAccept');
exports.bidsToAcceptReplicant = (0, nodecg_1.get)().Replicant('bidsToAccept');
exports.currentEventReplicant = (0, nodecg_1.get)().Replicant('currentEvent');

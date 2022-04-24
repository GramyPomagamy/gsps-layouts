"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replicants_1 = require("./util/replicants");
// Controls the name cycling ticks for players/hosts
function cycleNames(reset = false) {
    let cycle = 0;
    if (!reset) {
        cycle = replicants_1.nameCycleReplicant.value + 1;
    }
    if (cycle === 0) {
        // Name
        setTimeout(cycleNames, 45 * 1000);
    }
    else if (cycle === 1) {
        // Twitch
        setTimeout(cycleNames, 15 * 1000);
    }
    else {
        cycleNames(true);
        return;
    }
    replicants_1.nameCycleReplicant.value = cycle;
}
cycleNames(true);

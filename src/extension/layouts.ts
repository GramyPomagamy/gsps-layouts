import {
  nameCycleReplicant,
  activeRunReplicant,
  currentEventReplicant,
} from './util/replicants';

// Controls the name cycling ticks for players/hosts
function cycleNames(reset = false): void {
  let cycle = 0;
  if (!reset) {
    cycle = nameCycleReplicant.value + 1;
  }
  if (cycle === 0) {
    // Name
    setTimeout(cycleNames, 45 * 1000);
  } else if (cycle === 1) {
    // Twitch
    setTimeout(cycleNames, 15 * 1000);
  } else {
    cycleNames(true);
    return;
  }
  nameCycleReplicant.value = cycle;
}
cycleNames(true);

activeRunReplicant.on('change', (newVal) => {
  if (newVal) {
    if (newVal.customData.originalEvent) {
      currentEventReplicant.value = newVal.customData.originalEvent;
    } else {
      currentEventReplicant.value = '';
    }
  } else {
    currentEventReplicant.value = '';
  }
});

'use strict';
import { get as nodecg } from './util/nodecg';
import { big20Progress } from './util/replicants';

function increaseProgress(playerIndex: number) {
  const player = big20Progress.value.players[playerIndex];
  player.position = Math.min(19, player.position + 1);
}

function decreaseProgress(playerIndex: number) {
  const player = big20Progress.value.players[playerIndex];
  player.position = Math.max(0, player.position - 1);
}

nodecg().listenFor('increaseProgress', increaseProgress);
nodecg().listenFor('decreaseProgress', decreaseProgress);


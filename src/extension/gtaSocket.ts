import io from 'socket.io-client';
import { get as nodecg } from './util/nodecg';
import { completionRep } from './util/gtaReplicants';

const config = nodecg().bundleConfig.gtaTrilogy;
if(config) {
  const socket = io('ws://' + config.socket.address + ':' + config.socket.port);
  socket.on('connect', () => {
    nodecg().log.info('[Socket] Connected to companion socket.');
  });

  socket.on('disconnect', () => {
    nodecg().log.info('[Socket] Disconnected from companion socket.');
  });

  socket.on('completion', (data: string) => {
    completionRep.value = data;
  });
}



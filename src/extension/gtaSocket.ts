import io from 'socket.io-client';
import { get as nodecg } from './util/nodecg';
import { completionRep } from './util/gtaReplicants';
import { USER_AGENT } from './util/user-agent';

const config = nodecg().bundleConfig.gtaTrilogy?.socket;
if(config) {
  const socket = io('ws://' + config.address + ':' + config.port, {
    extraHeaders: { 'User-Agent': USER_AGENT },
  });
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



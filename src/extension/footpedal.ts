import { get } from './util/nodecg';
import { TaggedLogger } from './util/tagged-logger';

const nodecg = get();
const router = nodecg.Router();
const config = nodecg.bundleConfig.footpedal;
const log = new TaggedLogger('Footpedal');

router.get('/makeHighlight', (_req, res) => {
  if (config.enabled) {
    res.send('OK!');
    nodecg.sendMessage('makeHighlight');
  } else {
    res.send('Przełącznik jest wyłączony w konfiguracji');
    log.info('Przełącznik jest wyłączony w konfiguracji');
  }
});

router.get('/switchFromHostScreen', (_req, res) => {
  if (config.enabled) {
    res.send('OK!');
    nodecg.sendMessage('switchFromHostScreen');
  } else {
    res.send('Przełącznik jest wyłączony w konfiguracji');
    log.info('Przełącznik jest wyłączony w konfiguracji');
  }
});

nodecg.mount(router);

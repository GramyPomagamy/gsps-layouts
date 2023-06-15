import { BundleNodecgInstance } from './util/nodecg';
import NodeCG from '@nodecg/types';
import { TaggedLogger } from './util/tagged-logger';

/** Code relating to functions done by the footpedal (and some other stuff that also uses it). */
export const footpedal = (nodecg: BundleNodecgInstance) => {
  const router = (nodecg as unknown as NodeCG.ServerAPI).Router();
  const config = nodecg.bundleConfig.footpedal;
  const log = new TaggedLogger('footpedal');

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

  (nodecg as unknown as NodeCG.ServerAPI).mount(router);
};

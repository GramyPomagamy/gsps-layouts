import { get as nodecg } from './util/nodecg';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import type { NodeCG } from 'nodecg/types/server';
import { TaggedLogger } from './util/tagged-logger';

const router = nodecg().Router();
const config = (nodecg().bundleConfig as Configschema).footpedal;
const log = new TaggedLogger('footpedal');

router.get('/makeHighlight', (req: any, res: any) => {
  if (config.enabled) {
    res.send('OK!');
    nodecg().sendMessage('makeHighlight');
  } else {
    res.send('Przełącznik jest wyłączony w konfiguracji');
    log.info('Przełącznik jest wyłączony w konfiguracji');
  }
});

router.get('/demotywatory', (req: any, res: any) => {
  if (config.enabled) {
    res.send('OK!');
    nodecg().sendMessage('switchToDemoty');
  } else {
    res.send('Przełącznik jest wyłączony w konfiguracji');
    log.info('Przełącznik jest wyłączony w konfiguracji');
  }
});

nodecg().mount(router);

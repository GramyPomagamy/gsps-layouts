import { get as nodecg } from './util/nodecg';
import type { Configschema } from '@gsps-layouts/types/schemas/configschema';
import type { NodeCG } from 'nodecg/types/server';

const router = nodecg().Router();
const config = (nodecg().bundleConfig as Configschema).footpedal;
const log = new (nodecg() as NodeCG).Logger(`${nodecg().bundleName}:footpedal`);

router.get('/makeHighlight', (req: any, res: any) => {
  if (config.enabled) {
    res.send('OK!');
    nodecg().sendMessage('makeHighlight');
  } else {
    res.send('Przełącznik jest wyłączony w konfiguracji');
    log.info('Przełącznik jest wyłączony w konfiguracji');
  }
});

router.get('/switchToIntermission', (req: any, res: any) => {
  if (config.enabled) {
    res.send('OK!');
    nodecg().sendMessage('switchToIntermission');
  } else {
    res.send('Przełącznik jest wyłączony w konfiguracji');
    log.info('Przełącznik jest wyłączony w konfiguracji');
  }
});

nodecg().mount(router);

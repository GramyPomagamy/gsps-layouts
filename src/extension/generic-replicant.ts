import { get } from './util/nodecg';
import { TaggedLogger } from './util/tagged-logger';
import { GenericReplicant } from '../types/custom';
import express from 'express';

const nodecg = get();
const genericReplicant = nodecg.Replicant<GenericReplicant>('genericReplicant', {
  defaultValue: {},
});

const logger = new TaggedLogger('Generic Replicant');
const config = nodecg.bundleConfig.genericReplicant;
const router = nodecg.Router();
router.use(express.json());

if (config.enabled) {
  logger.debug('HTTP Endpoint dla GenericReplicant włączony');
  router.post('/generic-replicant/', (req, res) => {
    req.accepts('application/json');
    for (const [key, value] of Object.entries(req.body) as [string, string][]) {
      logger.error(key, value);
      genericReplicant.value[key] = value;
    }
    res.send('OK!');
  });
}

nodecg.mount(router);

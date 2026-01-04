/* eslint-disable no-unused-vars */
/**
 * This is a modified version of the augment-window.d.ts file included in
 * the NodeCG types, but allows us to automatically receive the configuration types.
 */

import { NodeCGAPIClient } from 'node_modules/nodecg/out/client/api/api.client';
import { Configschema } from './generated';

declare global {
  let NodeCG: typeof NodeCGAPIClient;
  let nodecg: NodeCGAPIClient<Configschema>;
}
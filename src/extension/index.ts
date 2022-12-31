/* eslint-disable global-require */

// This must go first so we can use module aliases!
/* eslint-disable import/first */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('module-alias').addAlias(
  '@gsps-layouts',
  require('path').join(__dirname, '.')
);

import type { NodeCG } from 'nodecg-types/types/server';
import { set } from './util/nodecg';

export = (nodecg: NodeCG): void => {
  /**
   * Because of how `import`s work, it helps to use `require`s to force
   * things to be loaded *after* the NodeCG context is set.
   */
  set(nodecg);
  require('./countdown');
  require('./host-countdown');
  require('./donations');
  require('./total');
  require('./bids');
  require('./layouts');
  require('./nowplaying');
  require('./obs');
  require('./highlighter');
  require('./footpedal');
  require('./milestones');
  require('./prizes');
  require('./featured');
  require('./timestamps');
};

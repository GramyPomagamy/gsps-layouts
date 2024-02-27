import NodeCG from '@nodecg/types';
import { set } from './util/nodecg';
import { Configschema } from '../types/generated';

export default (nodecg: NodeCG.ServerAPI<Configschema>) => {
  set(nodecg);
  require('./countdown');
  require('./bids');
  require('./donations-prizes');
  require('./featured');
  require('./foobar');
  require('./footpedal');
  require('./highlighter');
  require('./host-countdown');
  require('./layouts');
  require('./media-box');
  require('./milestones');
  require('./nowplaying');
  require('./obs');
  require('./scheduling');
  require('./sd');
  require('./secondary-timer');
  require('./timestamps');
  require('./total');
  require('./generic-replicant');
};

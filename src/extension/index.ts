import NodeCG from '@nodecg/types';
import { set } from './util/nodecg';
import { Configschema } from '../types/generated';

export default (nodecg: NodeCG.ServerAPI<Configschema>) => {
  set(nodecg);
  require('./countdown');
  require('./foobar');
  require('./layouts');
  require('./media-box');
  require('./nowplaying');
  require('./obs');
  require('./tipply');
};

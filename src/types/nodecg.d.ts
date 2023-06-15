import { CreateNodecgConstructor, CreateNodecgInstance } from 'ts-nodecg/browser';
import { Configschema } from './generated';
import { ReplicantMap } from './replicants';
import { MessageMap } from './messages';

export type BundleNodecgInstance = CreateNodecgInstance<
  'gsps-layouts',
  Configschema,
  ReplicantMap,
  MessageMap,
>;

export type BundleNodecgConstructor = CreateNodecgConstructor<
  'gsps-layouts',
  Configschema,
  ReplicantMap,
  MessageMap
>;

declare global {
  const nodecg: BundleNodecgInstance;

  const NodeCG: BundleNodecgConstructor;
}

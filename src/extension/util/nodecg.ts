import { CreateNodecgInstance } from 'ts-nodecg/server';
import { Configschema } from '../../types/generated';
import { ReplicantMap } from '../../types/replicants';
import { MessageMap } from '../../types/messages';
import { SpeedcontrolMessageMap, SpeedcontrolReplicantMap } from 'src/types/speedcontrol';

export type BundleNodecgInstance = CreateNodecgInstance<
  'gsps-layouts',
  Configschema,
  ReplicantMap,
  MessageMap
>;

export type SpeedcontrolNodecgInstance = CreateNodecgInstance<
  'nodecg-speedcontrol',
  Configschema,
  SpeedcontrolReplicantMap,
  SpeedcontrolMessageMap,
  true
>;

export type NodeCG = BundleNodecgInstance;

let nodecg: NodeCG;

export function set(ctx: NodeCG): void {
  nodecg = ctx;
}

export function get(): NodeCG {
  return nodecg;
}

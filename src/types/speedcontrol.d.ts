import { CreateNodecgConstructor, CreateNodecgInstance } from 'ts-nodecg/browser';
import {
  RunDataActiveRun,
  RunDataArray,
  Timer,
  RunDataActiveRunSurrounding,
  Configschema,
} from '../../../nodecg-speedcontrol/src/types/schemas';

export type SpeedcontrolReplicantMap = {
  runDataActiveRun: RunDataActiveRun;
  runDataArray: RunDataArray;
  timer: Timer;
  runDataActiveRunSurrounding: RunDataActiveRunSurrounding;
};

export type SpeedcontrolMessageMap = {
  changeToNextRun: {};
  repeaterFeaturedChannels: { data: Array<string> };
};

export type SpeedcontrolNodecgInstance = CreateNodecgInstance<
  'nodecg-speedcontrol',
  Configschema,
  SpeedcontrolReplicantMap,
  SpeedcontrolMessageMap,
  true
>;

export type SpeedcontrolNodecgConstructor = CreateNodecgConstructor<
  'nodecg-speedcontrol',
  Configschema,
  SpeedcontrolReplicantMap,
  SpeedcontrolMessageMap,
  true
>;

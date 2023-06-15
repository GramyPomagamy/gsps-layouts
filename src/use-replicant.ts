import { useEffect, useState } from 'react';
import { klona } from 'klona/json';
import { Replicant } from 'ts-nodecg/browser';

import { ReplicantMap as BundleReplicantMap } from './types/replicants';
import { SpeedcontrolReplicantMap } from './types/speedcontrol';

// Need to merge both map types for this to work
type ReplicantMap = BundleReplicantMap & SpeedcontrolReplicantMap;

export const useReplicant = <TRepName extends keyof ReplicantMap>(
  replicant:
    | Replicant<'gsps-layouts', ReplicantMap, TRepName, ReplicantMap[TRepName] | undefined>
    | Replicant<'nodecg-speedcontrol', ReplicantMap, TRepName, ReplicantMap[TRepName] | undefined>
): [ReplicantMap[TRepName] | undefined, (newValue: ReplicantMap[TRepName]) => void] => {
  const [value, updateValue] = useState<ReplicantMap[TRepName] | undefined>(undefined);

  const changeHandler = (newValue: ReplicantMap[TRepName]): void => {
    updateValue(klona(newValue));
  };

  useEffect(() => {
    replicant.on('change', changeHandler);
    return () => {
      replicant.removeListener('change', changeHandler);
    };
  }, [replicant]);

  return [
    value,
    (newValue) => {
      replicant.value = newValue;
    },
  ];
};

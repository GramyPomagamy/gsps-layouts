import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';
import { Fragment, useEffect, useState } from 'react';
import {
  type RunDataArray,
  type RunDataActiveRun,
  type RunData,
} from '../../../../../../nodecg-speedcontrol/src/types/schemas';
import { formatPlayers } from '../../../format-players';
import moment from 'moment';

const NextRunsContainer = styled.div`
  position: fixed;
  left: 65px;
  top: 150px;
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

const Label = styled.p`
  margin-bottom: -10px;
  font-size: 24px;
  font-weight: 700;
`;

const CurrentRun = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 5px;
  gap: 0px;
`;

const UpcomingRuns = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  line-height: 5px;
  gap: 5px;
  font-size: 24px;
`;

export const NextRuns = () => {
  const [currentRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  const [runs] = useReplicant<RunDataArray>('runDataArray', [], {
    namespace: 'nodecg-speedcontrol',
  });
  const [upcomingRuns, setUpcomingRuns] = useState<RunData[]>([]);

  useEffect(() => {
    if (typeof currentRun === 'undefined') return;

    const currentRunIndex = runs.findIndex((run) => run.id === currentRun.id);
    if (currentRunIndex > -1) {
      const upcomingRuns = runs.slice(currentRunIndex + 1, currentRunIndex + 7);
      setUpcomingRuns(upcomingRuns);
    }
  }, [currentRun]);

  if (!currentRun || !runs) {
    return null;
  }

  const isBehindSchedule = Date.now() > currentRun.scheduledS! * 1000;

  const now = moment();
  now.add(currentRun.setupTime);
  now.add(currentRun.estimate);
  const calcStartTime = (run: RunData) => {
    const startTime = now.format('HH:mm');
    now.add(run.setupTime);
    now.add(run.estimate);
    return startTime;
  };

  return (
    <NextRunsContainer>
      {currentRun && (
        <>
          <Label>ZA CHWILĘ</Label>
          <CurrentRun>
            <p className="shadow" style={{ fontSize: '40px', fontWeight: 700 }}>
              {currentRun.game}
            </p>
            <p className="shadow" style={{ fontSize: '26px', fontWeight: 500, marginTop: '2px' }}>
              {currentRun.category}
            </p>
            <p className="shadow" style={{ fontSize: '26px', fontWeight: 500, marginTop: '2px' }}>
              {formatPlayers(currentRun)}
            </p>
          </CurrentRun>
        </>
      )}
      {upcomingRuns && upcomingRuns.length > 0 && (
        <Fragment>
          <Label>NASTĘPNIE</Label>
          <UpcomingRuns>
            {upcomingRuns.map((run) => {
              if (!run.customData['hideOnStream']) {
                return (
                  <div
                    key={run.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '15px',
                      alignItems: 'center',
                    }}>
                    <p style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {isBehindSchedule
                        ? calcStartTime(run)
                        : moment(run.scheduled).format('HH:mm')}
                    </p>
                    <div className="shadow" style={{ display: 'flex', flexDirection: 'column' }}>
                      <p style={{ fontSize: '1.1em' }}>{run.game}</p>{' '}
                      <p style={{ marginTop: '5px', fontWeight: 500, fontSize: '0.9em' }}>
                        {run.category}
                      </p>
                    </div>
                  </div>
                );
              } else {
                // needs to be done to have the time calculations be correct even with the run hidden
                calcStartTime(run);
                return <></>;
              }
            })}
          </UpcomingRuns>
        </Fragment>
      )}
    </NextRunsContainer>
  );
};

export default NextRuns;

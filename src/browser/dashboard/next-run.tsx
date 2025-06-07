import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { Alert, Button, Stack } from '@mui/material';
import {
  RunData,
  RunDataActiveRunSurrounding,
  RunDataArray,
} from 'speedcontrol/src/types/schemas';
import { ObsData } from 'src/types/generated';
import { Timer } from 'speedcontrol/src/types/schemas/timer';
import { useEffect, useState } from 'react';

const intermissionSceneName = nodecg.bundleConfig.obs.scenes?.intermission;

export const App = () => {
  const [obsData] = useReplicant<ObsData | undefined>('obsData', undefined);
  const [timer] = useReplicant<Timer | undefined>('timer', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  const [runData] = useReplicant<RunDataArray | undefined>('runDataArray', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  const [runDataActiveRunSurrounding] = useReplicant<RunDataActiveRunSurrounding | undefined>(
    'runDataActiveRunSurrounding',
    undefined,
    {
      namespace: 'nodecg-speedcontrol',
    }
  );
  const [nextRun, setNextRun] = useState<RunData | undefined>(undefined);
  const [nextRunGameName, setNextRunGameName] = useState<string>('');

  useEffect(() => {
    setNextRun(getNextRun());
    setNextRunGameName(getNextRunGameName());
  }, [runData, runDataActiveRunSurrounding]);

  const getNextRun = (): RunData | undefined => {
    if (runData) {
      return runData.find((run) => run.id === runDataActiveRunSurrounding!.next);
    } else {
      return undefined;
    }
  };

  const getNextRunGameName = () => {
    const run = getNextRun();
    if (run && run.game) {
      return `${run.game.slice(0, 35)}${run.game.length > 35 ? '...' : ''}`;
    }
    return '(Run bez nazwy)';
  };

  const disableChange =
    (timer && ['running', 'paused'].includes(timer.state)) ||
    obsData?.scene === intermissionSceneName;

  return (
    <DashboardThemeProvider>
      <Stack spacing={2}>
        <Button
          variant="contained"
          disabled={disableChange || !nextRun || !obsData?.connected}
          onClick={() => {
            const run = getNextRun();
            if (run) {
              nodecg.sendMessage('switchToIntermission');
            }
          }}>
          <span>
            {nextRun ? (
              <>{nextRunGameName}</>
            ) : runData?.length ? (
              <>Koniec runów</>
            ) : (
              <>Brak dodanych runów</>
            )}
          </span>
        </Button>
        {disableChange && <Alert severity="info">Nie możesz zmienić gry w tym momencie.</Alert>}
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<App />);

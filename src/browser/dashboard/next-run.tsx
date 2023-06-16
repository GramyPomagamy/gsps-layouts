import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { SpeedcontrolNodecgInstance } from 'src/types/speedcontrol';
import { useReplicant } from '../../use-replicant';
import { Alert, Button, Stack } from '@mui/material';
import { RunData } from '../../../../nodecg-speedcontrol/src/types/schemas';

const obsDataRep = nodecg.Replicant('obsData');
const timerRep = (nodecg as unknown as SpeedcontrolNodecgInstance).Replicant(
  'timer',
  'nodecg-speedcontrol'
);
const runDataRep = (nodecg as unknown as SpeedcontrolNodecgInstance).Replicant(
  'runDataArray',
  'nodecg-speedcontrol'
);
const runDataActiveSurroundingRep = (nodecg as unknown as SpeedcontrolNodecgInstance).Replicant(
  'runDataActiveRunSurrounding',
  'nodecg-speedcontrol'
);

export const App = () => {
  const [obsData] = useReplicant(obsDataRep);
  const [timer] = useReplicant(timerRep);
  const [runData] = useReplicant(runDataRep);
  const [runDataActiveRunSurrounding] = useReplicant(runDataActiveSurroundingRep);

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

  const disableChange = timer && ['running', 'paused'].includes(timer.state);

  const nextRun = getNextRun();
  const nextRunGameName = getNextRunGameName();

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
              <>
                {nextRunGameName}
              </>
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

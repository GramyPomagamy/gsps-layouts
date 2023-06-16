import { useReplicant } from '../../use-replicant';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { Button, Grid, Typography } from '@mui/material';

const secondaryTimerRep = nodecg.Replicant('secondaryTimer');

export const App = () => {
  const [timer] = useReplicant(secondaryTimerRep);

  return (
    <DashboardThemeProvider>
      <div style={{ textAlign: 'center' }}>
        {timer && (
          <>
            {' '}
            <Typography variant="h3" gutterBottom>
              <b>{timer.time}</b>
            </Typography>
            <Grid style={{ width: '100%' }} container spacing={0} justifyContent="space-between">
              <Grid item xs={0}>
                <Button
                  variant="contained"
                  onClick={() => {
                    if (timer.phase == 'stopped' || timer.phase == 'paused') {
                      nodecg.sendMessage('secondaryTimerStart');
                    } else if (timer.phase == 'running') {
                      nodecg.sendMessage('secondaryTimerFinish');
                    }
                  }}
                  disabled={timer.phase === 'finished'}>
                  {timer.phase === 'running' ? 'Zakończ timer' : 'Rozpocznij timer'}
                </Button>
              </Grid>
              <Grid item xs={0}>
                <Button
                  variant="contained"
                  onClick={() => {
                    nodecg.sendMessage('secondaryTimerReset', true);
                  }}
                  disabled={timer.phase === 'stopped'}>
                  Resetuj timer
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </DashboardThemeProvider>
  );
};

render(<App />);

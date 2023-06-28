import { useReplicant } from 'use-nodecg';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { Button, FormControlLabel, FormGroup, Grid, Switch, Typography } from '@mui/material';
import { SecondaryTimer } from 'src/types/generated';

export const App = () => {
  const [timer, setTimer] = useReplicant<SecondaryTimer | undefined>('secondaryTimer', undefined);

  return (
    <DashboardThemeProvider>
      <div style={{ textAlign: 'center' }}>
        {timer && (
          <>
            {' '}
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={timer.enabled}
                    onChange={(event) => {
                      const newVal = { ...timer };
                      newVal.enabled = event.target.checked;
                      setTimer(newVal);
                    }}
                  />
                }
                label="Włącz dodatkowy timer"
              />
            </FormGroup>
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

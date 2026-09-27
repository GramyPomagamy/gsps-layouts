import { useReplicant } from 'use-nodecg';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { createRoot } from 'react-dom/client';
import { Button, Grid, Typography } from '@mui/material';
import { GtaTimer } from '../../types/generated';

const App = () => {
  const [timer] = useReplicant<GtaTimer | undefined>('gtaTimer', undefined);

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
                      nodecg.sendMessage('timerStart');
                    } else if (timer.phase == 'running') {
                      nodecg.sendMessage('timerPause');
                    }
                  }}
                  disabled={timer.phase === 'finished'}>
                  {timer.phase === 'running' ? 'Zapauzuj timer' : 'Rozpocznij timer'}
                </Button>
              </Grid>
              <Grid item xs={0}>
                <Button
                  variant="contained"
                  onClick={() => {
                    nodecg.sendMessage('timerReset', true);
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

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);

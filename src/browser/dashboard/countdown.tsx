import { useReplicant } from 'use-nodecg';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { createRoot } from 'react-dom/client';
import { Button, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Countdown, CountdownRunning } from '../../types/generated';

export const App = () => {
  const [countdown] = useReplicant<Countdown | undefined>('countdown', undefined);
  const [countdownRunning] = useReplicant<CountdownRunning>('countdownRunning', false);
  const [countdownText, setCountdownText] = useState('10:00');

  useEffect(() => {
    if (typeof countdown === 'undefined') return;

    setCountdownText(countdown.formatted);
  }, [countdown]);

  return (
    <DashboardThemeProvider>
      <TextField
        label="Czas odliczania"
        variant="filled"
        disabled={countdownRunning}
        value={countdownText}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCountdownText(event.target.value);
        }}
        style={{ marginBottom: '15px' }}
        fullWidth
      />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            onClick={() => {
              nodecg.sendMessage('startCountdown', countdownText);
            }}
            disabled={countdownRunning}>
            Rozpocznij odliczanie
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            onClick={() => {
              nodecg.sendMessage('stopCountdown');
            }}
            disabled={!countdownRunning}>
            Zatrzymaj odliczanie
          </Button>
        </Grid>
      </Grid>
    </DashboardThemeProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);

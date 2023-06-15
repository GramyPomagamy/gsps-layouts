import { useReplicant } from '../../use-replicant';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { createRoot } from 'react-dom/client';
import { Button, Grid, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

const countdownRep = nodecg.Replicant('countdown');
const countdownRunningRep = nodecg.Replicant('countdownRunning', {
  defaultValue: false,
  persistent: false,
});

const App = () => {
  const [countdownRunning] = useReplicant(countdownRunningRep);
  const [countdown] = useReplicant(countdownRep);
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

import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { Button, Grid, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useReplicant } from 'use-nodecg';
import { render } from '../render';

const App = () => {
  const [splitsTimer, setSplitsTimer] = useReplicant<number>('gtaSplitsTimer', 0);
  const [mediaTimer, setMediaTimer] = useReplicant<number>('gtaMediaTimer', 0);
  const [localSplitsTimer, setLocalSplitsTimer] = useState<number>(20);
  const [localMediaTimer, setLocalMediaTimer] = useState<number>(5);

  useEffect(() => {
    if (typeof splitsTimer === 'undefined') return;

    setLocalSplitsTimer(splitsTimer);
  }, [splitsTimer]);

  useEffect(() => {
    if (typeof mediaTimer === 'undefined') return;

    setLocalMediaTimer(mediaTimer);
  }, [mediaTimer]);

  return (
    <DashboardThemeProvider>
      <Stack>
        <Grid container>
          <TextField
            label="Długość pokazywania splitów w sekundach"
            onChange={(event) => {
              const nr = parseInt(event.target.value);
              if (!Number.isNaN(nr)) {
                setLocalSplitsTimer(nr);
              }
            }}
            style={{ width: '500px' }}
          />
          <p style={{ width: '200px' }}>Obecny cykl: {splitsTimer} sek.</p>
        </Grid>
        <Grid container>
          <TextField
            label="Długość pokazywania media boxa w sekundach"
            onChange={(event) => {
              const nr = parseInt(event.target.value);
              if (!Number.isNaN(nr)) {
                setLocalMediaTimer(nr);
              }
            }}
            style={{ width: '500px' }}
          />
          <p style={{ width: '200px' }}>Obecny cykl: {mediaTimer} sek.</p>
        </Grid>
        <Button
          variant="contained"
          disabled={localSplitsTimer == splitsTimer && localMediaTimer == mediaTimer}
          onClick={() => {
            setSplitsTimer(localSplitsTimer);
            setMediaTimer(localMediaTimer);
          }}>
          Zapisz zmiany
        </Button>
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<App />);

import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useState } from 'react';
import { Button, Container, Grid, Stack, TextField } from '@mui/material';

export const App = () => {
  const [amount, setAmount] = useState(0);

  return (
    <DashboardThemeProvider>
      <Container>
        <Stack spacing={1}>
          <TextField
            label="Kwota"
            variant="outlined"
            value={amount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setAmount(parseInt(event.target.value));
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  nodecg.sendMessage('setTotal', { type: 'cash', newValue: amount });
                  nodecg.getDialog('edit-total')!.close();
                }}
                fullWidth>
                Zapisz
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  nodecg.getDialog('edit-total')!.close();
                }}
                fullWidth>
                Anuluj
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </DashboardThemeProvider>
  );
};

render(<App />);

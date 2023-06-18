import { useReplicant } from 'use-nodecg';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import {
  Tooltip,
  Button,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Container,
  Stack,
} from '@mui/material';
import { AutoUpdateTotal, Total } from 'src/types/generated';

export const App = () => {
  const [total] = useReplicant<Total | undefined>('total', undefined);
  const [autoUpdateTotal, setAutoUpdateTotal] = useReplicant<AutoUpdateTotal>(
    'autoUpdateTotal',
    false
  );

  return (
    <DashboardThemeProvider>
      <Container>
        <Stack spacing={2}>
          <Tooltip
            title="Naciśnij, aby edytować kwotę"
            onClick={() => {
              nodecg.getDialog('edit-total')!.open();
            }}>
            <Paper style={{ textAlign: 'center' }} variant="outlined" elevation={3}>
              {total && (
                <Typography style={{ margin: '10px' }} variant="h4">
                  <b>{total.formatted}</b>
                </Typography>
              )}
            </Paper>
          </Tooltip>
          <Button
            variant="contained"
            onClick={() => {
              nodecg.sendMessage('updateTotal');
            }}>
            Zaktualizuj kwotę ręcznie
          </Button>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={autoUpdateTotal}
                  onChange={(event) => {
                    setAutoUpdateTotal(event.target.checked);
                  }}
                />
              }
              label="Aktualizuj kwotę automatycznie"
            />
          </FormGroup>
        </Stack>
      </Container>
    </DashboardThemeProvider>
  );
};

render(<App />);

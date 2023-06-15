import { useReplicant } from '../../use-replicant';
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
import NodeCG from '@nodecg/types';

const totalRep = nodecg.Replicant('total');
const autoUpdateTotalRep = nodecg.Replicant('autoUpdateTotal');

const App = () => {
  const [total] = useReplicant(totalRep);
  const [autoUpdateTotal, setAutoUpdateTotal] = useReplicant(autoUpdateTotalRep);

  return (
    <DashboardThemeProvider>
      <Container>
        <Stack spacing={2}>
          <Tooltip
            title="Naciśnij, aby edytować kwotę"
            onClick={() => {
              (nodecg as unknown as NodeCG.ClientAPI).getDialog('edit-total')!.open();
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

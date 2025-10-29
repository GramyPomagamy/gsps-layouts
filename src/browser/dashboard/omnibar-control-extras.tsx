import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import {
  FormGroup,
  FormControlLabel,
  Switch,
  Stack,
  Container,
} from '@mui/material';
export const App = () => {
  const [enableBids, setEnableBids] = useReplicant<boolean>("omnibarEnableBids", false);
  const [enableMilestones, setEnableMilestones] = useReplicant<boolean>("omnibarEnableMilestones", false);
  const [enableNextRuns, setEnableNextRuns] = useReplicant<boolean>("omnibarEnableNextRuns", false);
  const [enablePrizes, setEnablePrizes] = useReplicant<boolean>("omnibarEnablePrizes", false);

  return (
    <DashboardThemeProvider>
      <Container>
        <Stack spacing={2}>
          <FormGroup>
            <FormControlLabel
              control= 
              {
                <Switch checked={enableBids} onChange={(event) => {setEnableBids(event.target.checked); }}/>
              }
              label="Dodaj Informacje o Licytacjach"
            />
            <FormControlLabel
              control= 
              {
                <Switch checked={enableMilestones} onChange={(event) => {setEnableMilestones(event.target.checked); }}/>
              }
              label="Dodaj Informacje o Milestonach"
            />
            <FormControlLabel
              control= 
              {
                <Switch checked={enableNextRuns} onChange={(event) => {setEnableNextRuns(event.target.checked); }}/>
              }
              label="Dodaj Informacje o Nastepnych Runach"
            />
            <FormControlLabel
              control= 
              {
                <Switch checked={enablePrizes} onChange={(event) => {setEnablePrizes(event.target.checked); }}/>
              }
              label="Dodaj Informacje o Nagrodach"
            />
          </FormGroup>
        </Stack>
      </Container>
    </DashboardThemeProvider>
  );
};

render(<App />);
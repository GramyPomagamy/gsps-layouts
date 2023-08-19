import { useReplicant } from 'use-nodecg';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { render } from '../render';

const App = () => {
  const [showDonationBar, setShowDonationBar] = useReplicant<boolean>('showDonationBar', true);

  return (
    <DashboardThemeProvider>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={showDonationBar}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setShowDonationBar(event.target.checked);
              }}
            />
          }
          label="Pokaż pasek donacji"
        />
      </FormGroup>
    </DashboardThemeProvider>
  );
};

render(<App />);

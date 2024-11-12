import { useReplicant } from 'use-nodecg';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { render } from '../render';

const App = () => {
  const [useTransparentBackgrounds, setUseTransparentBackgrounds] = useReplicant<boolean>('useTransparentBackgrounds', true);

  return (
    <DashboardThemeProvider>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={useTransparentBackgrounds}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setUseTransparentBackgrounds(event.target.checked);
              }}
            />
          }
          label="Używaj przezroczystegło tła przerwy i odliczania"
        />
      </FormGroup>
    </DashboardThemeProvider>
  );
};

render(<App />);

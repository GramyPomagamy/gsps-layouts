import { useReplicant } from 'use-nodecg';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { render } from '../render';

const App = () => {
  const [currentGuide, setCurrentGuide] = useReplicant<string>('gtaCurrentGuide', 'hoXyy');
  const guides = nodecg.bundleConfig.gtaTrilogy?.players;

  const handlePlayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGuide((event.target as HTMLInputElement).value);
  };

  return (
    <DashboardThemeProvider>
      <FormControl>
        <FormLabel>
          Obecny Hołowczyc: <b>{currentGuide}</b>
        </FormLabel>
        <RadioGroup value={currentGuide} onChange={handlePlayerChange}>
          {guides?.map((guide) => {
            return <FormControlLabel value={guide} control={<Radio />} label={guide} />;
          })}
        </RadioGroup>
      </FormControl>
    </DashboardThemeProvider>
  );
};

render(<App />);

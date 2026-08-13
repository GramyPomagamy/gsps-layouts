import { useReplicant } from 'use-nodecg';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { render } from '../render';

const App = () => {
  const [currentPlayer, setCurrentPlayer] = useReplicant<string>('gtaCurrentPlayer', 'dexterw');
  const players = nodecg.bundleConfig.gtaTrilogy?.players;

  const handlePlayerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPlayer((event.target as HTMLInputElement).value);
  };

  return (
    <DashboardThemeProvider>
      <FormControl>
        <FormLabel>
          Obecny gracz: <b>{currentPlayer}</b>
        </FormLabel>
        <RadioGroup value={currentPlayer} onChange={handlePlayerChange}>
          {players?.map((player) => {
            return <FormControlLabel value={player} control={<Radio />} label={player} />;
          })}
        </RadioGroup>
      </FormControl>
    </DashboardThemeProvider>
  );
};

render(<App />);

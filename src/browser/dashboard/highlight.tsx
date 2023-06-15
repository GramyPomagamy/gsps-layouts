import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { Button, Stack } from '@mui/material';

const App = () => {
  return (
    <DashboardThemeProvider>
      <Stack>
        <Button
          variant="contained"
          onClick={() => {
            nodecg.sendMessage('makeHighlight');
          }}>
          Zrób highlight ręcznie
        </Button>
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<App />);

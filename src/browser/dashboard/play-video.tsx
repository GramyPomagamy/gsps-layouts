import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { Button, Stack } from '@mui/material';
import { ObsData } from 'src/types/generated';

const intermissionSceneName = nodecg.bundleConfig.obs.scenes?.intermission;

export const App = () => {
  const [obsData] = useReplicant<ObsData | undefined>('obsData', undefined);
  return (
    <DashboardThemeProvider>
      {obsData && (
        <Stack spacing={1} useFlexGap>
          <Button
            variant="contained"
            disabled={obsData.scene != intermissionSceneName}
            onClick={() => {
              nodecg.sendMessage('playIntermissionVideo', false);
            }}>
            Krótki film na przerwie
          </Button>
          <Button
            variant="contained"
            disabled={obsData.scene != intermissionSceneName}
            onClick={() => {
              nodecg.sendMessage('playIntermissionVideo', true);
            }}>
            Długi (ok. 5min) film na przerwie
          </Button>
        </Stack>
      )}
    </DashboardThemeProvider>
  );
};

render(<App />);

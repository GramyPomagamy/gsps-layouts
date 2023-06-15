import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from '../../use-replicant';
import { Typography } from '@mui/material';

const obsDataRep = nodecg.Replicant('obsData');

const App = () => {
  const [obsData] = useReplicant(obsDataRep);
  return (
    <DashboardThemeProvider>
      {obsData && (
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h5">
            <b>
              {!obsData.connected && <span style={{ color: 'red' }}>NIE </span>}
              <span style={{ color: obsData.connected ? 'green' : 'red' }}>POŁĄCZONO </span>z OBSem
            </b>
          </Typography>
          <Typography variant="h5">
            <b>
              <span>Stream: </span>
              {!obsData.streaming && <span style={{ color: 'red' }}>NIE </span>}
              <span style={{ color: obsData.streaming ? 'green' : 'red' }}>WŁĄCZONY</span>
            </b>
          </Typography>
          <Typography variant="h5">
            <b>
              <span>Nagrywanie: </span>
              {!obsData.recording && <span style={{ color: 'red' }}>NIE </span>}
              <span style={{ color: obsData.recording ? 'green' : 'red' }}>WŁĄCZONE</span>
            </b>
          </Typography>
        </div>
      )}
    </DashboardThemeProvider>
  );
};

render(<App />);

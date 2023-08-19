import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import {
  Paper,
  Container,
  Typography,
  Stack,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
} from '@mui/material';
import { useReplicant } from 'use-nodecg';
import { Asset, LogoCycle } from 'src/types/custom';
import { useEffect, useState } from 'react';

export const App = () => {
  return (
    <DashboardThemeProvider>
      <Container>
        <AssetTimeouts />
      </Container>
    </DashboardThemeProvider>
  );
};

const AssetTimeouts = () => {
  const [mediaBoxAssets] = useReplicant<Asset[]>('assets:media-box', []);
  const [mediaBoxBreakAssets] = useReplicant<Asset[]>('assets:media-box-break', []);
  const [logoCycles, setLogoCycles] = useReplicant<LogoCycle[]>('logoCycles', []);
  const [logoCyclesBreak, setLogoCyclesBreak] = useReplicant<LogoCycle[]>('logoCyclesBreak', []);
  const [localLogoCycles, setLocalLogoCycles] = useState<LogoCycle[]>([]);
  const [localLogoCyclesBreak, setLocalLogoCyclesBreak] = useState<LogoCycle[]>([]);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (typeof logoCycles === 'undefined') return;

    setLocalLogoCycles(logoCycles);
  }, [logoCycles]);

  useEffect(() => {
    if (typeof logoCyclesBreak === 'undefined') return;

    setLocalLogoCyclesBreak(logoCyclesBreak);
  }, [logoCyclesBreak]);

  function updateCycle(name: string, newCycle: string) {
    const index = localLogoCycles.findIndex((cycle) => cycle.name === name);
    const newCycles = [...localLogoCycles];
    if (index > -1) {
      const updatedCycle = { ...localLogoCycles[index], cycle: parseInt(newCycle), name: name };
      newCycles[index] = updatedCycle;
    } else {
      newCycles.push({ name: name, cycle: parseInt(newCycle) });
    }
    setLocalLogoCycles(newCycles);
  }

  function updateBreakCycle(name: string, newCycle: string) {
    const index = localLogoCyclesBreak.findIndex((cycle) => cycle.name === name);
    const newCycles = [...localLogoCyclesBreak];
    if (index > -1) {
      const updatedCycle = {
        ...localLogoCyclesBreak[index],
        cycle: parseInt(newCycle),
        name: name,
      };
      newCycles[index] = updatedCycle;
    } else {
      newCycles.push({ name: name, cycle: parseInt(newCycle) });
    }
    setLocalLogoCyclesBreak(newCycles);
  }

  return (
    <Paper>
      <Stack useFlexGap spacing={4} sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ marginTop: '10px' }}>
          <b>Cykle obrazów na mediaboxie</b>
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
            <Tabs
              variant="fullWidth"
              sx={{ width: '100%' }}
              value={currentTab}
              onChange={(_event, newVal: number) => {
                setCurrentTab(newVal);
              }}>
              <Tab label="Główne" />
              <Tab label="Przerwa" />
            </Tabs>
          </Box>
          <div id="main-tab" style={{ padding: '5px' }} hidden={currentTab != 0}>
            <Stack spacing={2}>
              <Button
                variant="contained"
                disabled={localLogoCycles == logoCycles}
                onClick={() => {
                  setLogoCycles(localLogoCycles);
                }}>
                Zapisz zmiany
              </Button>
              {mediaBoxAssets.map((asset) => {
                return (
                  <Paper elevation={3} key={asset.name}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        lineHeight: '0px',
                        marginTop: '5px',
                        marginBottom: '5px',
                        width: '100%',
                      }}>
                      <img src={asset.url} width="15%" />
                      <p>{asset.name}</p>
                      <p>
                        Obecny cykl: <span> </span>
                        {logoCycles.find((cycle) => cycle.name === asset.name)?.cycle || 10} sek.
                      </p>
                      <TextField
                        label="Długość cyklu w sekundach"
                        onChange={(event) => {
                          updateCycle(asset.name, event.target.value);
                        }}
                      />
                    </div>
                  </Paper>
                );
              })}
            </Stack>
          </div>
          <div id="break-tab" style={{ padding: '5px' }} hidden={currentTab != 1}>
            <Stack spacing={2}>
              <Button
                variant="contained"
                disabled={localLogoCyclesBreak == logoCyclesBreak}
                onClick={() => {
                  setLogoCyclesBreak(localLogoCyclesBreak);
                }}>
                Zapisz zmiany
              </Button>
              {mediaBoxBreakAssets.map((asset) => {
                return (
                  <Paper elevation={3} key={asset.name}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        lineHeight: '0px',
                        marginTop: '5px',
                        marginBottom: '5px',
                        width: '100%',
                      }}>
                      <img src={asset.url} width="15%" />
                      <p>{asset.name}</p>
                      <p>
                        Obecny cykl: <span> </span>
                        {logoCyclesBreak.find((cycle) => cycle.name === asset.name)?.cycle ||
                          10}{' '}
                        sek.
                      </p>
                      <TextField
                        label="Długość cyklu w sekundach"
                        onChange={(event) => {
                          updateBreakCycle(asset.name, event.target.value);
                        }}
                      />
                    </div>
                  </Paper>
                );
              })}
            </Stack>
          </div>
        </Box>
      </Stack>
    </Paper>
  );
};

render(<App />);

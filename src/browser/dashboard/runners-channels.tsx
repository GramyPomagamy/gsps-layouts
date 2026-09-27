import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { Channel } from 'src/types/custom';
import { channels as channelsMap } from '../channels';
import { Runner } from 'src/types/custom/runner';
import { RunDataActiveRun } from 'speedcontrol/src/types';

export const App = () => {
  const [liveRunnerChannel, setliveRunnerChannel] = useReplicant<Runner[]>('liveRunnerChannel', []);
  const [localRunnerChannel, setlocalRunnerChannel] = useState<Runner[]>([]);
  const [activeRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });

  function getPlayersName() {
    return activeRun?.teams.flatMap((team) => team.players).map((player) => player.name);
  }

  function prepareLocalObjects(): Runner[] {
    const names = getPlayersName();
    const runnerArray: Runner[] = [];
    names?.forEach((element) => {
      runnerArray.push({ name: element, channel: '' });
    });
    return runnerArray;
  }

  function updatePlayerChannel(playerIndex: number, channel: Channel) {
    const newState = localRunnerChannel.map((obj, index) => {
      if (index === playerIndex) {
        return { ...obj, channel: channel };
      }

      return obj;
    });
    setlocalRunnerChannel(newState);
  }

  useEffect(() => {
    setliveRunnerChannel(prepareLocalObjects());
  }, [activeRun]);

  useEffect(() => {
    if (typeof liveRunnerChannel === 'undefined') return;

    setlocalRunnerChannel(liveRunnerChannel);
  }, [liveRunnerChannel]);

  return (
    <DashboardThemeProvider>
      <Stack spacing={2}>
        {localRunnerChannel.map((runner, index) => (
          <div key={index}>
            <Grid container spacing={2} style={{ width: '100%', marginBottom: '25px' }}>
              <Grid item xs={7}>
                <TextField
                  variant="outlined"
                  value={runner.name}
                  label="Nick Runnera"
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel id={`channel-select-label-${index}`}>Kanał</InputLabel>
                  <Select
                    variant="outlined"
                    labelId={`channel-select-label-${index}`}
                    value={runner.channel as string}
                    label="Kanał"
                    onChange={(event: SelectChangeEvent) => {
                      updatePlayerChannel(index, event.target.value as Channel);
                    }}>
                    {Object.entries(channelsMap).map((channel) => (
                      <MenuItem key={channel[0]} value={channel[1]}>
                        {channel[0]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        ))}
        <Divider />
        <Button
          variant="contained"
          disabled={liveRunnerChannel === localRunnerChannel}
          onClick={() => {
            setliveRunnerChannel(localRunnerChannel);
          }}>
          Zapisz zmiany
        </Button>
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<App />);

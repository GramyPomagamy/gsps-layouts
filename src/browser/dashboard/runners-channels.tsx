import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { useEffect } from 'react';
import {
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
    const newState = liveRunnerChannel.map((obj, index) => {
      if (index === playerIndex) {
        return { ...obj, channel: channel };
      }

      return obj;
    });
    setliveRunnerChannel(newState);
  }

  useEffect(() => {
    const liveRunnersName = liveRunnerChannel.map((runner) => runner.name);
    const namesFromRun = getPlayersName();
    if (!namesFromRun || JSON.stringify(liveRunnersName) === JSON.stringify(namesFromRun)) {
      return; //refresh
    }
    setliveRunnerChannel(prepareLocalObjects());
  }, [activeRun]);

  return (
    <DashboardThemeProvider>
      <Stack spacing={2}>
        {liveRunnerChannel.map((runner, index) => (
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
                    {Object.entries(channelsMap).map(([channelName, channelValue]) => (
                      <MenuItem key={channelName as string} value={channelValue as string}>
                        {channelName as string}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        ))}
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<App />);

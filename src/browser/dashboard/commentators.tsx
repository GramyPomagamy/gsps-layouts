import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { useEffect, useState } from 'react';
import { Commentators } from '../../types/generated';
import {
  Button,
  Divider,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Pronouns, Channel } from 'src/types/custom';
import { pronouns as pronounsMap } from '../pronouns';
import { channels as channelsMap } from '../channels';
import DeleteIcon from '@mui/icons-material/Delete';

export const App = () => {
  const [liveCommentatorList, setLiveCommentatorList] = useReplicant<Commentators>(
    'commentators',
    []
  );
  const [localCommentatorList, setLocalCommentatorList] = useState<Commentators>([]);

  useEffect(() => {
    if (typeof liveCommentatorList === 'undefined') return;

    setLocalCommentatorList(liveCommentatorList);
  }, [liveCommentatorList]);

  function updateCommentatorName(commentatorIndex: number, name: string) {
    const newState = localCommentatorList.map((obj, index) => {
      if (index === commentatorIndex) {
        return { ...obj, name: name };
      }

      return obj;
    });

    setLocalCommentatorList(newState);
  }

  function updateCommentatorPronouns(commentatorIndex: number, pronouns: Pronouns) {
    const newState = localCommentatorList.map((obj, index) => {
      if (index === commentatorIndex) {
        return { ...obj, pronouns: pronouns };
      }

      return obj;
    });

    setLocalCommentatorList(newState);
  }

  function updateCommentatorChannel(commentatorIndex: number, channel: Channel) {
    const newState = localCommentatorList.map((obj, index) => {
      if (index === commentatorIndex) {
        return { ...obj, channel: channel };
      }

      return obj;
    });

    setLocalCommentatorList(newState);
  }

  return (
    <DashboardThemeProvider>
      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setLocalCommentatorList([...localCommentatorList, { name: '', pronouns: '', channel: '' }]);
          }}>
          Dodaj komentatora
        </Button>
        {localCommentatorList.map((commentator, index) => (
          <div key={index}>
            <Grid container spacing={2} style={{ width: '100%', marginBottom: '25px' }}>
              <Grid item xs={4.7}>
                <TextField
                  variant="outlined"
                  value={commentator.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateCommentatorName(index, event.target.value);
                  }}
                  label="Nick komentatora"
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id={`pronouns-select-label-${index}`}>Zaimki</InputLabel>
                  <Select
                    variant="outlined"
                    labelId={`pronouns-select-label-${index}`}
                    value={commentator.pronouns as string}
                    label="Zaimki"
                    onChange={(event: SelectChangeEvent) => {
                      updateCommentatorPronouns(index, event.target.value as Pronouns);
                    }}>
                    {Object.entries(pronounsMap).map((pronoun) => (
                      <MenuItem key={pronoun[0]} value={pronoun[1]}>
                        {pronoun[0]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id={`channel-select-label-${index}`}>Kanał</InputLabel>
                  <Select
                    variant="outlined"
                    labelId={`channel-select-label-${index}`}
                    value={commentator.channel as string}
                    label="Kanał"
                    onChange={(event: SelectChangeEvent) => {
                      updateCommentatorChannel(index, event.target.value as Channel);
                    }}>
                    {Object.entries(channelsMap).map((channel) => (
                      <MenuItem key={channel[0]} value={channel[1]}>
                        {channel[0]}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1}>
                <Tooltip title="Usuń komentatora">
                  <Fab
                    color="primary"
                    aria-label="delete"
                    onClick={() => {
                      const newVal = Array.from(localCommentatorList);
                      newVal.splice(index, 1);
                      setLocalCommentatorList(newVal);
                    }}>
                    <DeleteIcon />
                  </Fab>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        ))}
        <Divider />
        <Button
          variant="contained"
          disabled={liveCommentatorList?.length == 0}
          onClick={() => {
            setLiveCommentatorList([]);
          }}>
          Wyczyść komentatorów
        </Button>
        <Button
          variant="contained"
          disabled={liveCommentatorList === localCommentatorList}
          onClick={() => {
            setLiveCommentatorList(localCommentatorList);
          }}>
          Zapisz zmiany
        </Button>
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<App />);

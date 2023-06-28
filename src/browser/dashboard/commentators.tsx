import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { useEffect, useState } from 'react';
import { Commentators } from '../../types/generated';
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
import { Pronouns } from 'src/types/custom';
import { pronouns as pronounsMap } from '../pronouns';

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

  return (
    <DashboardThemeProvider>
      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setLocalCommentatorList([...localCommentatorList, { name: '', pronouns: '' }]);
          }}>
          Dodaj komentatora
        </Button>
        {localCommentatorList.map((commentator, index) => (
          <div key={index}>
            <Grid container spacing={2} style={{ width: '100%', marginBottom: '25px' }}>
              <Grid item xs={7}>
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
              <Grid item xs={5}>
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

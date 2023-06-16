import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from '../../use-replicant';
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Pronouns } from 'src/types/custom';
import { pronouns as pronounsMap } from '../pronouns';

const readerRep = nodecg.Replicant('reader');

export const App = () => {
  const [reader, setReader] = useReplicant(readerRep);
  const [readerName, setReaderName] = useState('');
  const [readerPronouns, setReaderPronouns] = useState<Pronouns>('');

  useEffect(() => {
    if (typeof reader === 'undefined') return;

    setReaderName(reader.name);
    setReaderPronouns(reader.pronouns);
  }, [reader]);

  return (
    <DashboardThemeProvider>
      <Stack spacing={1} useFlexGap>
        <Typography variant="h6" style={{ marginBottom: '25px' }} align="center">
          Obecny czytający:
          {reader && (
            <b>
              <span> </span>
              {reader.name} {reader.pronouns != '' && <>({reader.pronouns})</>}
            </b>
          )}
        </Typography>
        <Grid container spacing={2} style={{ width: '100%', marginBottom: '25px' }}>
          <Grid item xs={7}>
            <TextField
              variant="filled"
              value={readerName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setReaderName(event.target.value);
              }}
              label="Nick czytającego"
              fullWidth
            />
          </Grid>
          <Grid item xs={5}>
            <FormControl fullWidth>
              <InputLabel id="pronouns-select-label">Zaimki</InputLabel>
              <Select
                variant="filled"
                labelId="pronouns-select-label"
                value={readerPronouns as string}
                label="Zaimki"
                onChange={(event: SelectChangeEvent) => {
                  setReaderPronouns(event.target.value as Pronouns);
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
        <Button
          variant="contained"
          onClick={() => {
            setReader({ name: readerName, pronouns: readerPronouns });
          }}>
          Aktualizuj nick czytającego
        </Button>
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<App />);

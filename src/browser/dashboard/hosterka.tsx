import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { useListenFor, useReplicant } from 'use-nodecg';
import { render } from '../render';
import { Hosterka as HosterkaType } from 'src/types/generated';
import {
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  Stack,
  Typography,
  Select,
  TextField,
  SelectChangeEvent,
  MenuItem,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Host, Pronouns } from 'src/types/custom';
import { pronouns as pronounsMap } from '../pronouns';

const Hosterka = () => {
  const [hosterka, setHosterka] = useReplicant<HosterkaType | undefined>('hosterka', undefined);
  const [hostL, sethostL] = useState<Host>({ name: '', pronouns: '' });
  const [hostR, sethostR] = useState<Host>({ name: '', pronouns: '' });
  const [currentlyShowingNames, setCurrentlyShowingNames] = useState(false);

  useEffect(() => {
    if (typeof hosterka === 'undefined') return;

    sethostL(hosterka.hostL);
    sethostR(hosterka.hostR);
  }, [hosterka]);

  useListenFor('showNames', () => {
    setCurrentlyShowingNames(true);
  });

  useListenFor('hideNames', () => {
    setCurrentlyShowingNames(false);
  });

  return (
    <DashboardThemeProvider>
      {hosterka && (
        <Stack spacing={2}>
          <Container>
            <Typography sx={{ marginBottom: '15px' }}>
              <b>Lewy nick</b>
            </Typography>
            <Grid container spacing={2} style={{ width: '100%', marginBottom: '25px' }}>
              <Grid item xs={7}>
                <TextField
                  variant="outlined"
                  value={hostL.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    sethostL({ ...hostL, name: event.target.value });
                  }}
                  label="Nick czytającego"
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel id="pronouns-select-label">Zaimki</InputLabel>
                  <Select
                    variant="outlined"
                    labelId="pronouns-select-label"
                    value={hostL.pronouns as string}
                    label="Zaimki"
                    onChange={(event: SelectChangeEvent) => {
                      sethostL({ ...hostL, pronouns: event.target.value as Pronouns });
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
          </Container>
          <Divider />
          <Container>
            <Typography sx={{ marginBottom: '15px' }}>
              <b>Prawy nick</b>
            </Typography>
            <Grid container spacing={2} style={{ width: '100%', marginBottom: '25px' }}>
              <Grid item xs={7}>
                <TextField
                  variant="outlined"
                  value={hostR.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    sethostR({ ...hostR, name: event.target.value });
                  }}
                  label="Nick czytającego"
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel id="pronouns-select-label">Zaimki</InputLabel>
                  <Select
                    variant="outlined"
                    labelId="pronouns-select-label"
                    value={hostR.pronouns as string}
                    label="Zaimki"
                    onChange={(event: SelectChangeEvent) => {
                      sethostR({ ...hostR, pronouns: event.target.value as Pronouns });
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
          </Container>
          <Button
            disabled={hostL == hosterka.hostL && hostR == hosterka.hostR}
            onClick={() => {
              setHosterka({ hostL: hostL, hostR: hostR });
            }}
            variant="contained">
            Zapisz zmiany
          </Button>
          <Grid container style={{ width: '100%' }}>
            <Grid item xs={6}>
              <Button
                sx={{ width: '98.5%' }}
                variant="contained"
                disabled={currentlyShowingNames}
                onClick={() => {
                  nodecg.sendMessage('showNames');
                }}>
                Pokaż nicki
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                sx={{ width: '98.5%', marginLeft: '3px' }}
                variant="contained"
                disabled={!currentlyShowingNames}
                onClick={() => {
                  nodecg.sendMessage('hideNames');
                }}>
                Ukryj nicki
              </Button>
            </Grid>
          </Grid>
        </Stack>
      )}
    </DashboardThemeProvider>
  );
};

render(<Hosterka />);

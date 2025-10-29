import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { useEffect, useState } from 'react';
import {
  Button,
  Divider,
  Fab,
  Grid,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const App = () => {
  const [liveOmnibarTextList, setliveOmnibarTextList] = useReplicant<String[]>(
    'omnibarTextList',
    []
  );
  const [localOmnibarTextList, setlocalOmnibarTextList] = useState<String[]>([]);

  useEffect(() => {
    if (typeof liveOmnibarTextList === 'undefined') return;

    setlocalOmnibarTextList(liveOmnibarTextList);
  }, [liveOmnibarTextList]);

  function updateOmnibarText(omnibarTextIndex: number, text: string) {
    const newState = localOmnibarTextList.map((obj: String, index: number) => {
      if (index === omnibarTextIndex) {
        return text;
      }

      return obj;
    });

    setlocalOmnibarTextList(newState);
  }

  return (
    <DashboardThemeProvider>
      <Stack spacing={2}>
        <Button
          variant="contained"
          onClick={() => {
            setlocalOmnibarTextList([...localOmnibarTextList, '']);
          }}>
          Dodaj Tekst na Omnibar
        </Button>
        {localOmnibarTextList.map((omnibarText, index) => (
          <div key={index}>
            <Grid container spacing={1} style={{ width: '100%', marginBottom: '25px' }}>
              <Grid item xs={11}>
                <TextField
                  variant="outlined"
                  value={omnibarText}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateOmnibarText(index, event.target.value);
                  }}
                  label="Tekst"
                  fullWidth
                />
              </Grid>
              <Grid item xs={1}>
                <Tooltip title="Usuń Tekst na omnibarze">
                  <Fab
                    color="primary"
                    aria-label="delete"
                    onClick={() => {
                      const newVal = Array.from(localOmnibarTextList);
                      newVal.splice(index, 1);
                      setlocalOmnibarTextList(newVal);
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
          disabled={liveOmnibarTextList === localOmnibarTextList}
          onClick={() => {
            setliveOmnibarTextList(localOmnibarTextList);
          }}>
          Zapisz zmiany
        </Button>
      </Stack>
    </DashboardThemeProvider>
  );
};

render(<App />);

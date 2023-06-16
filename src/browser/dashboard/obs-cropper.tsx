import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from '../../use-replicant';
import { WindowInfo } from '../../types/generated';
import { useEffect, useState } from 'react';
import { Autocomplete, Button, Container, Stack, TextField, Typography } from '@mui/material';

const obsDataRep = nodecg.Replicant('obsData');

type Cropper = { index: number; windows: WindowInfo[]; name: string };

export const App = () => {
  const [obsData] = useReplicant(obsDataRep);
  const [croppers, setCroppers] = useState<Cropper[]>([]);

  useEffect(() => {
    if (typeof obsData === 'undefined') return;

    const newCroppers: Cropper[] = [];
    obsData.croppers.forEach((cropper, cropperIndex) => {
      newCroppers.push({ index: cropperIndex, windows: [], name: cropper.name });
    });
    setCroppers(newCroppers);
  }, [obsData]);

  useEffect(() => {
    function handleWindowsRefresh(windowsInfo: { cropperIndex: number; windows: WindowInfo[] }) {
      const newCropperList = [...croppers];
      if (typeof newCropperList[windowsInfo.cropperIndex] !== 'undefined') {
        newCropperList[windowsInfo.cropperIndex]!.windows = windowsInfo.windows;
      }
      setCroppers(newCropperList);
    }

    nodecg.listenFor('windowsRefreshed', handleWindowsRefresh);

    return () => {
      nodecg.unlisten('windowsRefreshed', handleWindowsRefresh);
    };
  });

  return (
    <DashboardThemeProvider>
      {croppers.map((cropper) => {
        return <Cropper cropper={cropper} key={cropper.index} />;
      })}
    </DashboardThemeProvider>
  );
};

type CropperProps = {
  cropper: Cropper;
};

export const Cropper = ({ cropper }: CropperProps) => {
  const [windowInfo, setWindowInfo] = useState<WindowInfo | undefined>(undefined);
  const [cropperInstance, setCropperInstance] = useState<Cropper>(cropper);

  useEffect(() => {
    setCropperInstance(cropper);
  }, [cropper]);

  return (
    <Container>
      {' '}
      <Stack spacing={1}>
        <Typography>
          <b>{cropperInstance.name}</b>
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            nodecg.sendMessage('resetCrop', cropperInstance.index);
          }}>
          Reset
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            nodecg.sendMessage('crop4By3', cropperInstance.index);
          }}>
          4:3
        </Button>

        <Autocomplete
          value={windowInfo}
          onChange={(_event, value) => {
            if (value) {
              setWindowInfo(value);
              if (windowInfo) {
                nodecg.sendMessage('crop', { cropperIndex: cropperInstance.index, windowInfo });
              }
            }
          }}
          disablePortal
          options={cropperInstance.windows}
          renderInput={(params) => <TextField {...params} label="Wybierz okno" />}
          getOptionLabel={(option) => {
            return `${option.windowTitle} - ${option.processName}`;
          }}
          noOptionsText="Ładowanie..."
          onMouseDown={() => {
            setWindowInfo(undefined);
            const cropper = cropperInstance;
            cropper.windows = [];
            setCropperInstance(cropper);
            nodecg.sendMessage('refreshWindows', cropperInstance.index);
          }}
        />
      </Stack>
    </Container>
  );
};

render(<App />);

import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useReplicant } from 'use-nodecg';
import { Cropper } from '../../types/custom';
import { useEffect, useState } from 'react';
import { Button, Divider, Stack, TextField } from '@mui/material';
import { ObsData } from 'src/types/generated';

export const App = () => {
  const [obsData] = useReplicant<ObsData | undefined>('obsData', undefined);
  const [croppers, setCroppers] = useState<{ index: number; cropper: Cropper }[]>([]);

  useEffect(() => {
    if (typeof obsData === 'undefined') return;

    const croppers: { index: number; cropper: Cropper }[] = [];
    obsData.croppers.forEach((cropper, cropperIndex) => {
      croppers.push({ index: cropperIndex, cropper: cropper });
    });
    setCroppers(croppers);
  }, [obsData]);

  return (
    <DashboardThemeProvider>
      <Button
        variant="contained"
        onClick={() => {
          nodecg.sendMessage('addCropper');
        }}>
        Dodaj
      </Button>
      {croppers.map((cropper) => (
        <CropperSettings index={cropper.index} cropper={cropper.cropper} key={cropper.index} />
      ))}
    </DashboardThemeProvider>
  );
};

type CropperProps = {
  index: number;
  cropper: Cropper;
};

export const CropperSettings = ({ index, cropper }: CropperProps) => {
  const [cropperName, setCropperName] = useState('');
  const [cropperScene, setCropperScene] = useState('');
  const [cropperSource, setCropperSource] = useState('');
  const [cropperURL, setCropperURL] = useState('');

  useEffect(() => {
    setCropperName(cropper.name);
    setCropperScene(cropper.sceneName);
    setCropperSource(cropper.sourceName);
    setCropperURL(cropper.url);
  }, [cropper]);

  return (
    <Stack spacing={2} marginTop={1}>
      <Divider />
      <TextField
        value={cropperName}
        variant="filled"
        label="Nazwa"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCropperName(event.target.value);
        }}
        fullWidth
      />
      <TextField
        value={cropperScene}
        variant="filled"
        label="Scena"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCropperScene(event.target.value);
        }}
        fullWidth
      />
      <TextField
        value={cropperSource}
        variant="filled"
        label="Źródło"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCropperSource(event.target.value);
        }}
        fullWidth
      />
      <TextField
        value={cropperURL}
        variant="filled"
        label="URL"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setCropperURL(event.target.value);
        }}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={() => {
          nodecg.sendMessage('modifyCropper', {
            cropperIndex: index,
            newCropper: {
              name: cropperName,
              sceneName: cropperURL,
              url: cropperURL,
              sourceName: cropperSource,
            },
          });
        }}>
        Zapisz
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          nodecg.sendMessage('removeCropper', index);
        }}>
        Usuń
      </Button>
    </Stack>
  );
};

render(<App />);

import { useReplicant } from 'use-nodecg';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import type { SongProgress } from 'src/types/generated';

function formatSeconds(inputSeconds: number): string {
  const minutes = Math.floor(inputSeconds / 60);
  const seconds = Math.floor(inputSeconds - minutes * 60);
  const secondsPadded = seconds.toString().padStart(2, '0');
  return `${minutes}:${secondsPadded}`;
}

const App = () => {
  const [songProgress] = useReplicant<SongProgress>('songProgress', {"duration": 0, "position": 0});

  return (
    <DashboardThemeProvider>
      <p>
        {formatSeconds(songProgress.position)} / {formatSeconds(songProgress.duration)} (-{formatSeconds(Math.floor(songProgress.duration) - Math.floor(songProgress.position))})
      </p>
    </DashboardThemeProvider>
  );
};

render(<App />);

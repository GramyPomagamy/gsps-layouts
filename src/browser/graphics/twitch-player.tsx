import { render } from '../render';
import ThemeProvider from './components/theme-provider';
import { useEffect, useMemo, useState } from 'react';
import { TwitchStream } from './components/twitch-player/TwitchStream';
import { useReplicant } from 'use-nodecg';
import { PlayerStreams } from 'src/types/generated';

function getPlayerInfo(params: URLSearchParams) {
  const width = params.get('width') || '1920';
  const height = params.get('height') || '1080';
  const playerSlot = parseInt(params.get('playerSlot') || '0');
  return { width, height, playerSlot };
}

export const TwitchPlayer = () => {
  const params = useMemo(() => getPlayerInfo(new URLSearchParams(window.location.search)), []);
  const { width, height, playerSlot } = params;
  const [playerStreams] = useReplicant<PlayerStreams | undefined>('playerStreams', undefined);
  const [channel, setChannel] = useState('');

  useEffect(() => {
    if (!playerStreams) return;

    switch (playerSlot) {
      case 0:
        setChannel(playerStreams.player1);
        break;
      case 1:
        setChannel(playerStreams.player2);
        break;
      case 2:
        setChannel(playerStreams.player3);
        break;
      case 3:
        setChannel(playerStreams.player4);
        break;
      default:
        setChannel(playerStreams.player1);
        break;
    }
  }, [playerStreams]);

  return (
    <ThemeProvider>
      <TwitchStream width={width} height={height} channel={channel} />
    </ThemeProvider>
  );
};

render(<TwitchPlayer />);

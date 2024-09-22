import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useEffect, useState } from 'react';
import { Button, Container } from '@mui/material';

const StreamAssign = () => {
  const [currentFeed, setCurrentFeed] = useState(0);
  const [showStreams, setShowStreams] = useState(false);
  const [streams, setStreams] = useState<string[]>([]);

  useEffect(() => {
    setStreams((nodecg.bundleConfig.streams!.accounts as string[]) || []);
  }, []);

  return (
    <DashboardThemeProvider>
      <Container>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentFeed(0);
            setShowStreams(true);
          }}
          disabled={currentFeed === 0 && showStreams}>
          Stream 1
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentFeed(1);
            setShowStreams(true);
          }}
          disabled={currentFeed === 1 && showStreams}>
          Stream 2
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentFeed(2);
            setShowStreams(true);
          }}
          disabled={currentFeed === 2 && showStreams}>
          Stream 3
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setCurrentFeed(3);
            setShowStreams(true);
          }}
          disabled={currentFeed === 3 && showStreams}>
          Stream 4
        </Button>
      </Container>
      {showStreams == true && (
        <Container>
          <>
            {streams.map((stream) => {
              return (
                <Button
                  key={stream}
                  variant="contained"
                  onClick={() => {
                    setShowStreams(false);
                    nodecg.sendMessage('setFeedStream', {
                      feed: currentFeed,
                      twitchStream: stream,
                    });
                  }}>
                  {stream}
                </Button>
              );
            })}
          </>
        </Container>
      )}
    </DashboardThemeProvider>
  );
};

render(<StreamAssign />);

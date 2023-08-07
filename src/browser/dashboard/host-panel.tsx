import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { Button, Container, Paper, Stack } from '@mui/material';
import { Bids, Milestones, Total } from './reader-panel';
import { useEffect, useState } from 'react';
import { useReplicant } from 'use-nodecg';
import { Bid, Prize } from 'src/types/custom';
import { Countdown as CountdownType } from 'src/types/generated';

export const BidPrizePanel = () => {
  const [currentBid] = useReplicant<Bid | null>('currentlyShownBid', null);
  const [currentPrize] = useReplicant<Prize | null>('currentlyShownPrize', null);
  const [shownItemOnPanel, setShownItemOnPanel] = useState<{
    type: 'bid' | 'prize';
    data: Bid | Prize;
  } | null>(null);
  const [showPrizePanel] = useReplicant<boolean>('showPrizePanel', false);
  const [showBidPanel] = useReplicant<boolean>('showBidsPanel', false);

  useEffect(() => {
    if (!currentBid) return;
    if (!showBidPanel) return;

    setShownItemOnPanel({ type: 'bid', data: currentBid });
  }, [currentBid, showBidPanel]);

  useEffect(() => {
    if (!currentPrize) return;
    if (!showPrizePanel) return;

    setShownItemOnPanel({ type: 'prize', data: currentPrize });
  }, [currentPrize, showPrizePanel]);

  return (
    <>
      {(showBidPanel || showPrizePanel) && (
        <Paper
          sx={{
            width: '500px',
            height: '100px',
            display: 'flex',
            flexDirection: 'column',
            padding: '5px',
          }}>
          <h3
            style={{
              width: '100%',
              textAlign: 'center',
              color: 'white',
              marginTop: '10px',
            }}>
            {shownItemOnPanel ? (
              <>
                {shownItemOnPanel.type == 'bid' ? (
                  <>OBECNIE POKAZYWANA LICYTACJA</>
                ) : (
                  <>OBECNIE POKAZYWANA NAGRODA</>
                )}
              </>
            ) : (
              <>OBECNIE POKAZYWANA NAGRODA/LICYTACJA</>
            )}
          </h3>
          <div id="data" style={{ margin: 3, textAlign: 'center' }}>
            <b style={{ fontSize: '20px' }}>
              {shownItemOnPanel && (
                <>
                  {shownItemOnPanel.type === 'bid' ? (
                    <>
                      {(shownItemOnPanel.data as Bid).game} -
                      {(shownItemOnPanel.data as Bid).description}
                    </>
                  ) : (
                    <>{(shownItemOnPanel.data as Prize).name}</>
                  )}
                </>
              )}
            </b>
          </div>
        </Paper>
      )}
    </>
  );
};

const Countdown = () => {
  const [hostCountdown] = useReplicant<CountdownType | undefined>('hostCountdown', undefined);
  const [hostCountdownRunning] = useReplicant<boolean>('hostCountdownRunning', false);

  function countdownStyles() {
    const underLimitColor = '#357C3C';
    const warningColor = '#FFC300';
    const overLimitColor = '#FF5959';
    const warningSeconds = 30;
    const msInSecond = 1000;
    const baseFontSize = 48;
    const maxFontSize = 380;

    const secondsLeft = hostCountdown!.raw / msInSecond;

    let fontSize = baseFontSize;
    let color = underLimitColor;
    if (secondsLeft <= 0) {
      color = overLimitColor;
      fontSize = Math.min(baseFontSize + -secondsLeft * 2, maxFontSize);
    } else if (secondsLeft <= warningSeconds) {
      color = warningColor;
    }

    return { color: color, fontSize: `${fontSize}px` };
  }

  return (
    <>
      {hostCountdown && hostCountdownRunning && (
        <Paper sx={{minWidth: '450px', textAlign: 'center'}}>
          <Stack spacing={0}>
            <h3
              style={{
                width: '100%',
                textAlign: 'center',
                color: 'white',
                marginTop: '10px',
              }}>
              POZOSTAŁY CZAS
            </h3>
            <b>
              <span style={countdownStyles()}>{hostCountdown.formatted}</span>
            </b>
          </Stack>
        </Paper>
      )}
    </>
  );
};

const HostPanel = () => {
  return (
    <DashboardThemeProvider>
      <Container disableGutters>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '25px', alignItems: 'center' }}>
            <BidPrizePanel />
            <Countdown />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              padding: '5px',
              gap: '15px',
            }}>
            <div id="left" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <Bids />
            </div>
            <div id="right" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <Total />
              <Milestones />
              <Button
                variant="contained"
                onClick={() => {
                  nodecg.sendMessage('switchFromHostScreen');
                }}>
                Awaryjny przycisk zmiany na przerwę
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </DashboardThemeProvider>
  );
};

render(<HostPanel />);

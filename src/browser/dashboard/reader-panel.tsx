import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { render } from '../render';
import { useListenFor, useReplicant } from 'use-nodecg';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Bids as BidsType,
  DonationsToRead,
  Reader as ReaderType,
  Total as TotalType,
} from 'src/types/generated';
import { RunDataActiveRun, RunDataTeam } from '../../../../nodecg-speedcontrol/src/types';
import { Timer } from '../../../../nodecg-speedcontrol/src/types/schemas/timer';
import { useEffect, useRef, useState } from 'react';
import { Bid, Milestones as MilestonesType, Pronouns } from 'src/types/custom';
import RefreshIcon from '@mui/icons-material/Refresh';
import { pronouns as pronounsMap } from '../pronouns';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import pl from 'dayjs/locale/pl';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

export const Total = () => {
  const [total] = useReplicant<TotalType | undefined>('total', undefined);

  return (
    <Paper sx={{ textAlign: 'center', padding: '5px' }}>
      {total && <b style={{ fontSize: '48px' }}>{total.formatted}</b>}
    </Paper>
  );
};

export const RunStatus = () => {
  const [currentRun] = useReplicant<RunDataActiveRun | undefined>('runDataActiveRun', undefined, {
    namespace: 'nodecg-speedcontrol',
  });
  const [timer] = useReplicant<Timer | undefined>('timer', undefined, {
    namespace: 'nodecg-speedcontrol',
  });

  const formatPlayers = (team: RunDataTeam) => {
    return team.players.map((player) => player.name).join(', ');
  };

  return (
    <Paper style={{ textAlign: 'center', padding: '5px' }}>
      <div id="timer" style={{ fontSize: '36px' }}>
        <b>{timer?.time}</b>
      </div>
      {currentRun && (
        <>
          <div id="run">
            <p style={{ fontSize: '20px' }}>
              <b>{currentRun.game}</b>
              <div style={{ fontSize: '16px' }}>{currentRun.category}</div>
            </p>
          </div>
          <Divider />
          <div id="players" style={{ padding: '5px 10px 5px 10px', fontSize: '20px' }}>
            {currentRun.teams.map((team) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                  key={team.id}>
                  <p style={{ float: 'left' }}>{formatPlayers(team)}</p>
                  {timer && timer.teamFinishTimes[team.id] ? (
                    <p style={{ float: 'right', textAlign: 'right' }}>
                      {timer.teamFinishTimes[team.id]?.time}
                    </p>
                  ) : (
                    <p>W trakcie</p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </Paper>
  );
};

export const Milestones = () => {
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(false);
  const [milestones] = useReplicant<MilestonesType>('milestones', []);
  const [total] = useReplicant<TotalType | undefined>('total', undefined);

  useListenFor('milestones:updating', () => {
    setUpdating(true);
  });

  useListenFor('milestones:updated', () => {
    setUpdating(false);
  });

  return (
    <Paper sx={{ height: '597px', width: '510px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginLeft: '10px', marginRight: '10px' }}>
        <h3
          style={{
            width: '100%',
            textAlign: 'center',
            color: 'white',
            marginTop: '10px',
          }}>
          CELE
        </h3>
        <div
          id="filter"
          style={{
            display: 'flex',
            width: '100%',
            gap: '5px',
            justifyContent: 'space-between',
          }}>
          <TextField
            label="Filtruj..."
            value={filter}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFilter(event.target.value);
            }}
            variant="outlined"
            sx={{ flex: 1 }}
          />
          <Tooltip title="Odśwież ręcznie">
            <Button
              disabled={updating}
              onClick={() => {
                nodecg.sendMessage('updateMilestones');
              }}
              aria-label="refresh"
              color="primary"
              variant="outlined">
              {updating ? <CircularProgress /> : <RefreshIcon />}
            </Button>
          </Tooltip>
        </div>
        <div
          id="milestones"
          style={{ padding: '10px', height: '453px', overflow: 'auto', marginTop: '10px' }}>
          <div id="open-milestones">
            {total && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {milestones.map((milestone) => {
                  return (
                    <>
                      {milestone.name.toLowerCase().includes(filter) &&
                        total.raw! < milestone.amount && (
                          <>
                            <Milestone
                              key={milestone.name}
                              milestone={milestone}
                              met={total.raw! >= milestone.amount}
                              total={total.raw!}
                            />
                          </>
                        )}
                    </>
                  );
                })}
              </div>
            )}
          </div>
          <div id="closed-milestones">
            {total && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {milestones.map((milestone) => {
                  return (
                    <>
                      {milestone.name.toLowerCase().includes(filter) &&
                        total.raw! >= milestone.amount && (
                          <>
                            <Milestone
                              key={milestone.name}
                              milestone={milestone}
                              met={total.raw! >= milestone.amount}
                              total={total.raw!}
                            />
                          </>
                        )}
                    </>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Paper>
  );
};

const Milestone = ({
  milestone,
  met,
  total,
}: {
  milestone: { name: string; amount: number };
  met: boolean;
  total: number;
}) => {
  return (
    <div
      style={{
        border: '1px solid white',
        borderRadius: '4px',
        padding: '5px',
        backgroundColor: met ? '#106310' : '#484a48',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
      }}>
      <p style={{ fontSize: '22px', margin: 5 }}>
        <b>{milestone.name}</b>
      </p>
      <p style={{ fontSize: '20px', margin: 5, fontWeight: 700 }}>
        {total} zł / {milestone.amount} zł{' '}
        {!met && <>(pozostało {(milestone.amount - total).toFixed(0)} zł)</>}
      </p>
    </div>
  );
};

const Reader = () => {
  const [reader, setReader] = useReplicant<ReaderType | undefined>('reader', undefined);
  const [readerName, setReaderName] = useState('');
  const [readerPronouns, setReaderPronouns] = useState<Pronouns>('');
  const [readerAlert] = useReplicant<boolean>('readerAlert', false);

  useEffect(() => {
    if (typeof reader === 'undefined') return;

    setReaderName(reader.name);
    setReaderPronouns(reader.pronouns);
  }, [reader]);

  return (
    <Paper sx={{ padding: '15px', width: '520px' }}>
      <Stack spacing={1} useFlexGap>
        <Typography variant="h5" style={{ marginBottom: '25px' }} align="center">
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
              variant="outlined"
              value={readerName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setReaderName(event.target.value);
              }}
              label="Nick"
              fullWidth
            />
          </Grid>
          <Grid item xs={5}>
            <FormControl fullWidth>
              <InputLabel id="pronouns-select-label">Zaimki</InputLabel>
              <Select
                variant="outlined"
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
          Aktualizuj
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            nodecg.sendMessage('toggleAlert');
          }}
          color={readerAlert ? 'warning' : 'primary'}>
          {readerAlert ? (
            <>Usuń powiadomienie</>
          ) : (
            <>Daj runnerowi znać, że chcesz coś powiedzieć</>
          )}
        </Button>
      </Stack>
    </Paper>
  );
};

export const Bids = () => {
  const [bids] = useReplicant<BidsType>('allBids', []);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const refreshTimer = useRef<NodeJS.Timeout>();

  function bidName(bid: Bid) {
    return `${bid.game} - ${bid.name}`.toLowerCase();
  }

  useListenFor('bids:updating', () => {
    clearInterval(refreshTimer.current);
    setUpdating(true);
  });

  useListenFor('bids:updated', () => {
    setTimeLeft(20);
    setUpdating(false);

    clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(() => {
      if (timeLeft == 1) {
        clearInterval(refreshTimer.current);
        setTimeLeft(0);
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);
  });

  useEffect(() => {
    clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(() => {
      if (timeLeft == 1) {
        clearInterval(refreshTimer.current);
        setTimeLeft(0);
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);
  }, [timeLeft]);

  return (
    <Paper
      sx={{
        padding: '5px',
        height: '612px',
        width: '540px',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <h3
        style={{
          width: '100%',
          textAlign: 'center',
          color: 'white',
          marginTop: '10px',
        }}>
        LICYTACJE
      </h3>
      <div id="refreshCountdown" style={{ textAlign: 'center' }}>
        {updating ? (
          <>
            <LinearProgress />
            <p>Odświeżam...</p>
          </>
        ) : (
          <>
            <LinearProgress variant="determinate" value={(timeLeft / 20) * 100} />
            <p>Odświeżam za {timeLeft} sekund...</p>
          </>
        )}
      </div>
      <div
        id="filter"
        style={{
          display: 'flex',
          width: '100%',
          gap: '5px',
          justifyContent: 'space-between',
        }}>
        <TextField
          label="Filtruj..."
          value={filter}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilter(event.target.value);
          }}
          variant="outlined"
          sx={{ flex: 1 }}
        />
        <Tooltip title="Odśwież ręcznie">
          <Button
            disabled={updating}
            onClick={() => {
              nodecg.sendMessage('updateBids');
            }}
            aria-label="refresh"
            color="primary"
            variant="outlined">
            {updating ? <CircularProgress /> : <RefreshIcon />}
          </Button>
        </Tooltip>
      </div>
      <div
        id="bids"
        style={{
          padding: '10px',
          height: '468px',
          overflow: 'auto',
          marginTop: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}>
        <div id="open-bids" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {bids.map((bid: Bid) => {
            return (
              <>
                {bidName(bid).includes(filter) && bid.state != 'CLOSED' && (
                  <>
                    {bid.type === 'challenge' ? (
                      <BidGoal bid={bid} key={bid.id} />
                    ) : (
                      <BidWar bid={bid} key={bid.id} />
                    )}
                  </>
                )}
              </>
            );
          })}
        </div>
        <div id="closed-bids" style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {bids.map((bid: Bid) => {
            return (
              <>
                {bidName(bid).includes(filter) && bid.state == 'CLOSED' && (
                  <>
                    {bid.type === 'challenge' ? (
                      <BidGoal bid={bid} key={bid.id} />
                    ) : (
                      <BidWar bid={bid} key={bid.id} />
                    )}
                  </>
                )}
              </>
            );
          })}
        </div>
      </div>
    </Paper>
  );
};

const BidGoal = ({ bid }: { bid: Bid }) => {
  function etaUntil(bid: Bid) {
    return bid.runStartTime
      ? dayjs
          .unix(bid.runStartTime / 1000)
          .tz('Europe/Warsaw')
          .locale(pl)
          .fromNow(true)
      : undefined;
  }

  function formattedDate(bid: Bid) {
    return dayjs
      .unix(bid.runStartTime! / 1000)
      .tz('Europe/Warsaw')
      .locale(pl)
      .format('LLL');
  }

  return (
    <div
      style={{
        border: '1px solid white',
        borderRadius: '4px',
        padding: '5px',
        backgroundColor: bid.state == 'CLOSED' ? '#106310' : '#484a48',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
      }}>
      <p style={{ fontSize: '22px', margin: 5 }}>
        <b>
          {bid.game} - {bid.name}
        </b>
      </p>
      <p style={{ fontSize: '14px', marginTop: 0 }}>
        {etaUntil(bid) && (
          <>
            <Tooltip title={formattedDate(bid)} arrow>
              <i>Ten run odbędzie się planowo za ok. {etaUntil(bid)}</i>
            </Tooltip>
          </>
        )}
      </p>
      <p style={{ marginTop: 2 }}>{bid.longDescription && <>{bid.longDescription}</>}</p>
      <p style={{ fontSize: '20px', margin: 5, fontWeight: 700 }}>
        {bid.rawTotal} zł / {bid.rawGoal} zł{' '}
        {bid.state != 'CLOSED' && <>(pozostało {(bid.rawGoal! - bid.rawTotal).toFixed(0)} zł)</>}
      </p>
    </div>
  );
};

const BidWar = ({ bid }: { bid: Bid }) => {
  function etaUntil(bid: Bid) {
    return bid.runStartTime
      ? dayjs
          .unix(bid.runStartTime / 1000)
          .tz('Europe/Warsaw')
          .locale(pl)
          .fromNow(true)
      : undefined;
  }

  function formattedDate(bid: Bid) {
    return dayjs
      .unix(bid.runStartTime! / 1000)
      .tz('Europe/Warsaw')
      .locale(pl)
      .format('LLL');
  }

  return (
    <div
      style={{
        border: '1px solid white',
        borderRadius: '4px',
        padding: '5px',
        backgroundColor: bid.state == 'CLOSED' ? '#106310' : '#484a48',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '0px',
      }}>
      <p style={{ fontSize: '22px', margin: 5 }}>
        <b>
          {bid.game} - {bid.name}
        </b>
      </p>
      <p style={{ fontSize: '14px', marginTop: 0 }}>
        {etaUntil(bid) && (
          <>
            <Tooltip title={formattedDate(bid)} arrow>
              <i>Ten run odbędzie się planowo za ok. {etaUntil(bid)}</i>
            </Tooltip>
          </>
        )}
      </p>
      <div id="options" style={{ lineHeight: '15px', marginTop: 1 }}>
        {bid.options.map((option, index) => {
          return (
            <p>
              <b>{index + 1}. </b>
              {option.name} - <b>{option.rawTotal} zł</b>
              {index > 0 && <> (-{(bid.options[0]!.rawTotal - option.rawTotal).toFixed(0)} zł)</>}
            </p>
          );
        })}
      </div>
    </div>
  );
};

const Donations = () => {
  const [donationsToRead] = useReplicant<DonationsToRead>('donationsToRead', []);
  const [donationsToAccept] = useReplicant<number>('donationsToAccept', 0);
  const [bidsToAccept] = useReplicant<number>('bidsToAccept', 0);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const refreshTimer = useRef<NodeJS.Timeout>();

  useListenFor('donationsToRead:updating', () => {
    clearInterval(refreshTimer.current);
    setUpdating(true);
  });

  useListenFor('donationsToRead:updated', () => {
    setTimeLeft(10);
    setUpdating(false);

    clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(() => {
      if (timeLeft == 1) {
        clearInterval(refreshTimer.current);
        setTimeLeft(0);
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);
  });

  useEffect(() => {
    clearInterval(refreshTimer.current);
    refreshTimer.current = setInterval(() => {
      if (timeLeft == 1) {
        clearInterval(refreshTimer.current);
        setTimeLeft(0);
      }
      setTimeLeft(timeLeft - 1);
    }, 1000);
  }, [timeLeft]);

  return (
    <Paper
      sx={{
        width: '550px',
        height: '890px',
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
        DONACJE DO PRZECZYTANIA
      </h3>
      <div id="refreshCountdown" style={{ textAlign: 'center' }}>
        {updating ? (
          <>
            <LinearProgress />
            <p>Odświeżam...</p>
          </>
        ) : (
          <>
            <LinearProgress variant="determinate" value={(timeLeft / 10) * 100} />
            <p>Odświeżam za {timeLeft} sekund...</p>
          </>
        )}
      </div>
      <div
        id="filter"
        style={{
          display: 'flex',
          width: '100%',
          gap: '5px',
          justifyContent: 'space-between',
        }}>
        <TextField
          label="Filtruj..."
          value={filter}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilter(event.target.value);
          }}
          variant="outlined"
          sx={{ flex: 1 }}
        />
        <Tooltip title="Odśwież ręcznie">
          <Button
            disabled={updating}
            onClick={() => {
              nodecg.sendMessage('updateDonations');
            }}
            aria-label="refresh"
            color="primary"
            variant="outlined">
            {updating ? <CircularProgress /> : <RefreshIcon />}
          </Button>
        </Tooltip>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ padding: 5 }}>
          Donacje do zaakceptowania: <b>{donationsToAccept}</b>
        </div>
        <div style={{ padding: 5 }}>
          Bidy do zaakceptowania: <b>{bidsToAccept}</b>
        </div>
      </div>
      <Divider />

      <div style={{ padding: 5, height: '100%', overflow: 'auto' }}>
        {donationsToRead.length ? (
          <>
            {donationsToRead.map((donation) => {
              return <Donation donation={donation} key={donation.id} />;
            })}
          </>
        ) : (
          <p style={{ width: '100%', textAlign: 'center' }}></p>
        )}
      </div>
    </Paper>
  );
};

const Donation = ({
  donation,
}: {
  donation: {
    id: number;
    name: string;
    amount: number;
    comment?: string;
    timestamp: number;
    bid?: {
      id?: number;
      amount?: number;
    }[];
  };
}) => {
  const [bids] = useReplicant<BidsType>('allBids', []);

  const donationDataToSend = { id: donation.id, name: donation.name, amount: donation.amount };

  function formatAmount(amount: number) {
    return amount.toFixed(2);
  }

  function formatDate(date: number) {
    return dayjs
      .unix(date / 1000)
      .tz('Europe/Warsaw')
      .locale(pl)
      .format('LLL');
  }

  function getBidName(id: number) {
    let bidName = '';
    Array.from(bids).forEach((bid) => {
      if (bid.id === id) {
        bidName = `${bid.game} - ${bid.name}`;
      }
    });

    if (bidName) {
      return bidName;
    } else {
      const bidWars = Array.from(bids).filter((bid) => bid.type != 'challenge');
      bidWars.forEach((bid) => {
        bid.options.forEach((option) => {
          if (option.id === id) {
            console.log(`found id ${id}`);
            bidName = `${bid.game} - ${bid.name} - ${option.name}`;
          }
        });
      });
      return bidName;
    }
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          {donation.name} - {donation.amount} zł
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ width: '100%' }}>
          <p>
            <b>Wpłacający: </b>
            {donation.name}
          </p>
          <p>
            <b>Kwota: </b>
            {formatAmount(donation.amount)} zł
          </p>
          <p>
            <b>Wpłacono: </b> {formatDate(donation.timestamp)}
          </p>
          <div>
            <p>
              <b>Komentarz</b>
            </p>
            <p>{donation.comment}</p>
          </div>
          {donation.bid && donation.bid.length && (
            <>
              <p>
                <b>Licytacje</b>
              </p>
              {donation.bid.map((bid) => {
                return (
                  <p key={bid.id}>
                    {getBidName(bid.id!)} - {bid.amount} zł
                  </p>
                );
              })}
            </>
          )}
          <Button
            sx={{ width: '100%' }}
            variant="contained"
            onClick={() => {
              nodecg.sendMessage('setDonationAsRead', donationDataToSend);
            }}>
            Zaznacz donację jako przeczytaną
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

const ReaderPanel = () => {
  return (
    <DashboardThemeProvider>
      <Container disableGutters>
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
            <Reader />
            <Bids />
          </div>
          <div id="middle" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <Total />
            <RunStatus />
            <Milestones />
          </div>
          <div id="right" style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <Donations />
          </div>
        </div>
      </Container>
    </DashboardThemeProvider>
  );
};

render(<ReaderPanel />);

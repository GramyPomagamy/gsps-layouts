import { styled } from 'styled-components';
import { render } from '../render';
import ThemeProvider from './components/theme-provider';
import Timer from './components/timer';
import { useReplicant } from 'use-nodecg';
import { DonationsToRead, Reader } from 'src/types/generated';
import { klona as clone } from 'klona/json';

const Container = styled.div`
  text-align: center;
  width: 100%;
  height: 100%;
  text-shadow: black 2px 2px 8px;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
`;

const DonationsContainer = styled.div`
  width: 100%;
  margin-top: 10px;
  font-size: 28px;
  line-height: 30px;
  padding-bottom: 1px;
`;

const App = () => {
  const [readerAlert] = useReplicant<boolean>('readerAlert', false);
  const [donationsToRead] = useReplicant<DonationsToRead>('donationsToRead', []);
  const [reader] = useReplicant<Reader | undefined>('reader', undefined);

  const topDonationAmount = () => {
    if (donationsToRead.length) {
      const sorted = clone(donationsToRead).sort((a, b) => {
        return b.amount - a.amount;
      });
      return `${sorted[0]!.amount.toFixed(2)} zł`;
    } else {
      return '0.00 zł';
    }
  };

  const backgroundColor = () => {
    if (readerAlert) {
      return '#FFC300';
    } else if (donationsToRead.length > 0) {
      return '#357C3C';
    } else {
      return 'black';
    }
  };

  return (
    <ThemeProvider>
      <Container
        onClick={(event) => {
          event.currentTarget.requestFullscreen();
        }}
        style={{ backgroundColor: backgroundColor() }}>
        <div id="run-container">
          <Timer fontSize={46} />
        </div>
        <DonationsContainer>
          {readerAlert && <p>Czytający chce coś powiedzieć</p>}
          <p>Donacje oczekujące na przeczytanie: {donationsToRead.length}</p>
          <p>Największa donacja: {topDonationAmount()}</p>
          <br />
          {reader && (
            <p>
              Obecny czytający: {reader.name} {reader.pronouns && <>({reader.pronouns})</>}
            </p>
          )}
        </DonationsContainer>
      </Container>
    </ThemeProvider>
  );
};

render(<App />);

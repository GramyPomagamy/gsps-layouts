import DonationBar from './components/donation-bar';
import styled from 'styled-components';
import ThemeProvider from './components/theme-provider';
import { render } from '../render';

const Donations = styled.div`
  position: fixed;
  width: 1920px;
  height: 44px;
  bottom: 0px;
`;

export const App = () => {
  return (
    <ThemeProvider>
      <Donations>
        <DonationBar />
      </Donations>
    </ThemeProvider>
  );
};

render(<App />);

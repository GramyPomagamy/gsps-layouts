import styled from 'styled-components';
import { render } from '../render';
import Ticker from './components/omnibar/ticker';
/* import Total from './components/omnibar/total'; */
import ThemeProvider from './components/theme-provider';

const OmnibarContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: #e6e6e6;
  color: rgb(60, 60, 60);
  display: flex;
  justify-content: space-between;
  align-content: space-between;
`;

export const Omnibar = () => {
  return (
    <ThemeProvider>
      <OmnibarContainer>
        <Ticker />
        {/* <Total /> */}
      </OmnibarContainer>
    </ThemeProvider>
  );
};

render(<Omnibar />);

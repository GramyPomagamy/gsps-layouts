import styled from 'styled-components';
import { render } from '../render';

const OmnibarContainer = styled.div`
  width: 100%;
  height: 50px;
  background-color: #e6e6e6;
  color: rgb(60, 60, 60);
  justify-content: space-between;
  align-content: space-between;
`;

export const Omnibar = () => {
  return <OmnibarContainer></OmnibarContainer>;
};

render(<Omnibar />);

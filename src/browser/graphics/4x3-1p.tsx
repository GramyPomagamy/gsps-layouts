import { render } from '../render';
import layoutBg from './img/layouts/4x3-1p.png';
import styled from 'styled-components';
import './css/style.css';
import RunInfo from './components/run-info';
import Timer from './components/timer';
import MediaBox from './components/media-box';

const LayoutContainer = styled.div`
  width: 1920px;
  height: 1030px;
  background-image: url(${layoutBg});
  margin: 0;
  padding: 0;
`;

const Info = styled.div`
  width: 543px;
  height: 688px;
  position: fixed;
  top: 338px;
  text-align: center;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
`;

export const App = () => {
  return (
    <LayoutContainer>
      <Info>
        <RunInfo fontSize={44} />
        <Timer fontSize={80} />
        <MediaBox useTopBorder />
      </Info>
    </LayoutContainer>
  );
};

render(<App />);

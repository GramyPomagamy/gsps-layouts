import styled from 'styled-components';

const FinishTimeContainer = styled.div<{ side: 'left' | 'right' }>`
  width: 150px;
  background-color: #5f3ac2;
  height: 30px;
  display: flex;
  flex-direction: ${(props) => (props.side == 'right' ? 'row-reverse' : 'row')};
`;

const TimeDiv = styled.div`
  font-size: 24px;
  flex: 1;
  height: 100%;
`;

const PlaceDiv = styled.div`
  background-color: #ffbd16;
  color: #35216b;
  font-size: 25px;
  min-width: 25px;
`;

const FinishTime = ({
  time,
  place,
  side,
}: {
  time: string;
  place: number;
  side: 'left' | 'right';
}) => {
  return (
    <FinishTimeContainer side={side}>
      <TimeDiv>
        <p style={{ margin: 'auto' }}>{time}</p>
      </TimeDiv>
      <PlaceDiv>{place}</PlaceDiv>
    </FinishTimeContainer>
  );
};

export default FinishTime;

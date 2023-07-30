import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ReadDonations } from 'src/types/generated';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const getDonationColor = (amount: number) => {
  if (amount >= 50 && amount <= 99) {
    return '#5f3ac2';
  } else if (amount >= 100) {
    return '#c79516';
  } else {
    return 'rgb(60, 60, 60)';
  }
};

const DonationBarContainer = styled.div`
  width: 100%;
  height: 44px;
  background-color: #e6e6e6;
  display: flex;
  gap: 30px;
  flex-direction: row;
  align-content: center;
  padding: 10px;
`;

const DonationEl = styled.span<{ amount: number }>`
  font-size: 24px;
  text-align: center;
  white-space: nowrap;
  font-weight: ${(props) => (props.amount >= 100 ? '700' : '600')};
  color: ${(props) => getDonationColor(props.amount)};
`;

type Donation = { id: number; name: string; amount: number };

const Donation = ({ donation }: { donation: Donation }) => {
  return (
    <DonationEl amount={donation.amount}>
      {donation.name} - {donation.amount} PLN
    </DonationEl>
  );
};

const DonationBar = () => {
  const [readDonations] = useReplicant<ReadDonations>('readDonations', []);

  return (
    <DonationBarContainer>
      <TransitionGroup component={null}>
        {readDonations.map((donation) => {
          return (
            <CSSTransition key={donation.id} timeout={1000} classNames="fade" appear in>
              <Donation donation={donation} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </DonationBarContainer>
  );
};

export default DonationBar;

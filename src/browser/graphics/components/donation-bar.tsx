import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { ReadDonations } from 'src/types/generated';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const getDonationColors = (amount: number) => {
  if (amount >= 50 && amount <= 99) {
    return { color: '#ffbd16', background: '#5f3ac2' };
  } else if (amount >= 100) {
    return { color: '#35216b', background: '#ffbd16' };
  } else {
    return { color: '#ffbd16', background: '#35216b' };
  }
};

const DonationBarContainer = styled.div`
  width: 100%;
  height: 44px;
  background-color: #e6e6e6;
  display: flex;
  flex-direction: row;
  align-content: center;
  white-space: nowrap;
  overflow: hidden;
`;

const DonationEl = styled.span<{ amount: number }>`
  font-size: 24px;
  text-align: center;
  white-space: nowrap;
  font-weight: ${(props) => (props.amount >= 100 ? '700' : '600')};
  color: ${(props) => getDonationColors(props.amount).color};
  background-color: ${(props) => getDonationColors(props.amount).background};
  padding-top: 8px;
  padding-left: 15px;
  padding-right: 15px;
`;

type DonationType = { id: number; name: string; amount: number };

const Donation = ({ donation }: { donation: DonationType }) => {
  return (
    <DonationEl amount={donation.amount}>
      {donation.name} - {donation.amount.toFixed(0)} EUR
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
            <CSSTransition key={donation.id} timeout={1000} classNames="slide-in-bottom" appear in>
              <Donation donation={donation} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </DonationBarContainer>
  );
};

export default DonationBar;

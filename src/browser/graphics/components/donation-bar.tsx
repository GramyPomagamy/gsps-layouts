import { ReadDonations } from 'src/types/generated';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const DonationBarContainer = styled.div`
  width: 100%;
  height: 44px;
  background-color: #e6e6e6;
  color: rgb(60, 60, 60);
  display: flex;
  gap: 30px;
  flex-direction: row;
  align-content: center;
  padding: 10px;
`;

const Donation = styled.span`
  font-size: 24px;
  text-align: center;
  white-space: nowrap;
`;

const DonationBar = () => {
  const [readDonations] = useReplicant<ReadDonations>('readDonations', []);

  return (
    <DonationBarContainer>
      {readDonations.map((donation) => {
        return (
          <Donation key={donation.id}>
            {donation.name} - {donation.amount} PLN
          </Donation>
        );
      })}
    </DonationBarContainer>
  );
};

export default DonationBar;

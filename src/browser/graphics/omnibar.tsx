import styled from 'styled-components';
import { render } from '../render';
import Ticker from './components/omnibar/ticker';
import './css/style.css';
import { Total as TotalType } from 'src/types/generated';
import { useEffect, useState } from 'react';
import gsap from 'gsap';

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
    <OmnibarContainer>
      <Ticker />
      <Total />
    </OmnibarContainer>
  );
};

const AmountDiv = styled.div`
  font-size: 34px;
  align-self: flex-end;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: auto;
  margin-bottom: auto;
  text-align: right;
  font-variant-numeric: tabular-nums;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const Currency = styled.div`
  font-size: 0.7em;
`;

const Total = () => {
  const totalRep = nodecg.Replicant<TotalType>('total');
  const [amount, setAmount] = useState({ raw: 0, formatted: '0' });
  const localAmount = { raw: 0 };

  useEffect(() => {
    const ctx = gsap.context(() => {
      totalRep.on('change', (newVal) => {
        if (typeof newVal != 'undefined') {
          gsap.to(localAmount, {
            duration: 5,
            raw: newVal.raw,
            roundProps: 'raw',
            ease: 'power4',
            onUpdate: () => {
              setAmount({
                raw: localAmount.raw,
                formatted: localAmount.raw.toLocaleString('en-US', {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }),
              });
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <AmountDiv>
      {amount.formatted}
      <Currency>PLN</Currency>
    </AmountDiv>
  );
};

render(<Omnibar />);

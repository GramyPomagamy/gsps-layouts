import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Total as TotalType } from 'src/types/generated';
import gsap from 'gsap';

const AmountDiv = styled.div`
  font-size: 96px;
  align-self: flex-end;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: auto;
  margin-bottom: auto;
  text-align: center;
  font-variant-numeric: tabular-nums;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  position: fixed;
  top: 150px;
  right: 120px; 
`;

const Currency = styled.div`
  font-size: 0.5em;
`;

export const Total = () => {
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
    <AmountDiv className='shadow'>
      {amount.formatted}
      <Currency>PLN</Currency>
    </AmountDiv>
  );
};

export default Total;

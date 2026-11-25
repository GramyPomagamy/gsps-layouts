import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { Total as TotalType } from 'src/types/generated';
import gsap from 'gsap';
import { plnFormatter } from 'src/utils/format-pln';

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
`;

export const Total = () => {
  const totalRep = nodecg.Replicant<TotalType>('total');
  const [amount, setAmount] = useState(0);
  const localAmount = { raw: 0 };

  useEffect(() => {
    const ctx = gsap.context(() => {
      totalRep.on('change', (newVal: any) => {
        if (typeof newVal != 'undefined') {
          gsap.to(localAmount, {
            duration: 5,
            raw: newVal.raw,
            roundProps: 'raw',
            ease: 'power4',
            onUpdate: () => setAmount(localAmount.raw),
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return <AmountDiv>{plnFormatter.format(amount)}</AmountDiv>;
};

export default Total;

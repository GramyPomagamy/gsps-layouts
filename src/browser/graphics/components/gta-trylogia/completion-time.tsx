import { GtaSplits as SplitsType } from 'src/types/generated';
import styled from 'styled-components';
import { useReplicant } from 'use-nodecg';

const Splits = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Split = styled.span`
  display: flex;
  flex-direction: row;
  text-align: center;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const CompletionTime = () => {
  const [splits] = useReplicant<SplitsType>('gtaSplits', []);

  return (
    <Splits>
      <p style={{ fontSize: '30px', fontWeight: '600' }}>CZASY UKOŃCZENIA GIER</p>
      <div>
        {splits.map((split) => (
          <Split key={split.name}>
            <span
              className="shadow"
              style={{
                fontSize: split.name != 'GTA III' && split.delta != 0 ? '32px' : '40px',
              }}>
              {split.name}
            </span>
            {split.delta != 0 && (
              <span style={{ fontSize: '24px' }}>
                - {split.formattedOriginalTime} ({split.formattedDelta})
              </span>
            )}
          </Split>
        ))}
      </div>
    </Splits>
  );
};

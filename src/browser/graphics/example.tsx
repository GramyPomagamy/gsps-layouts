import { createRoot } from 'react-dom/client';
import exampleImage from './image.png';
import { useReplicant } from 'use-nodecg';
import { ExampleReplicant } from '../../types/generated';

const App = () => {
  const [exampleReplicant] = useReplicant<ExampleReplicant>('exampleReplicant', {
    exampleProperty: '',
  });

  return (
    <>
      <img src={exampleImage} />
      <p>{exampleReplicant.exampleProperty}</p>
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);

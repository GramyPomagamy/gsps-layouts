import Button from '@mui/material/Button';
import exampleImage from './image.png';
import { useReplicant } from 'use-nodecg';
import { ExampleReplicant } from '../../types/generated';
import { DashboardThemeProvider } from './components/DashboardThemeProvider';
import { createRoot } from 'react-dom/client';

const App = () => {
  const [exampleReplicant, setExampleReplicant] = useReplicant<ExampleReplicant>(
    'exampleReplicant',
    { exampleProperty: '' }
  );

  return (
    <DashboardThemeProvider>
      <img src={exampleImage} />
      <p>Current example replicant value: {exampleReplicant.exampleProperty}</p>
      <Button
        variant="contained"
        onClick={() => {
          setExampleReplicant({ exampleProperty: Date.now().toString() });
        }}>
        <b>Test button (updates the replicant with current date)</b>
      </Button>
    </DashboardThemeProvider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);

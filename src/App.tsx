import TabletDisplay from './components/TabletDisplay';
import PasswordGate from './components/PasswordGate';
import './App.css';

function App() {
  return (
    <PasswordGate>
      <TabletDisplay />
    </PasswordGate>
  );
}

export default App;

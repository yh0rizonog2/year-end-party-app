import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase';
import AdminDashboard from './components/AdminDashboard';
import TabletDisplay from './components/TabletDisplay';
import PasswordGate from './components/PasswordGate';
import type { GameState } from './types';
import './App.css';

function App() {
  const [view, setView] = useState<'select' | 'admin' | string>('select');
  const [teams, setTeams] = useState<GameState['teams'] | null>(null);

  useEffect(() => {
    const teamsRef = ref(database, 'game/teams');
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTeams(data);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <PasswordGate>
      {view === 'select' && (
        <div className="view-selector">
          <h1>2025年グランドツー忘年会</h1>
          <p>表示を選択してください</p>
          <div className="view-buttons">
            <button onClick={() => setView('admin')} className="view-button admin">
              管理画面
            </button>
            <button
              onClick={() => setView('teamA')}
              className="view-button team-a"
              style={teams?.teamA ? { backgroundColor: teams.teamA.color } : undefined}
            >
              {teams?.teamA?.name || 'チームA'} タブレット
            </button>
            <button
              onClick={() => setView('teamB')}
              className="view-button team-b"
              style={teams?.teamB ? { backgroundColor: teams.teamB.color } : undefined}
            >
              {teams?.teamB?.name || 'チームB'} タブレット
            </button>
            <button
              onClick={() => setView('teamC')}
              className="view-button team-c"
              style={teams?.teamC ? { backgroundColor: teams.teamC.color } : undefined}
            >
              {teams?.teamC?.name || 'チームC'} タブレット
            </button>
          </div>
        </div>
      )}

      {view === 'admin' && (
        <>
          <button className="back-button" onClick={() => setView('select')}>
            ← 戻る
          </button>
          <AdminDashboard />
        </>
      )}

      {view !== 'select' && view !== 'admin' && (
        <>
          <button className="back-button" onClick={() => setView('select')}>
            ← 戻る
          </button>
          <TabletDisplay teamId={view} />
        </>
      )}
    </PasswordGate>
  );
}

export default App;

import { useState } from 'react';
import AdminDashboard from './components/AdminDashboard';
import TabletDisplay from './components/TabletDisplay';
import './App.css';

function App() {
  const [view, setView] = useState<'select' | 'admin' | string>('select');

  if (view === 'select') {
    return (
      <div className="view-selector">
        <h1>2025年グランドツー忘年会</h1>
        <p>表示を選択してください</p>
        <div className="view-buttons">
          <button onClick={() => setView('admin')} className="view-button admin">
            管理画面
          </button>
          <button onClick={() => setView('teamA')} className="view-button team-a">
            チームA タブレット
          </button>
          <button onClick={() => setView('teamB')} className="view-button team-b">
            チームB タブレット
          </button>
          <button onClick={() => setView('teamC')} className="view-button team-c">
            チームC タブレット
          </button>
        </div>
        <p className="note">
          ※ Firebase の設定が必要です。.env ファイルを作成してください。
        </p>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <>
        <button className="back-button" onClick={() => setView('select')}>
          ← 戻る
        </button>
        <AdminDashboard />
      </>
    );
  }

  return (
    <>
      <button className="back-button" onClick={() => setView('select')}>
        ← 戻る
      </button>
      <TabletDisplay teamId={view} />
    </>
  );
}

export default App;

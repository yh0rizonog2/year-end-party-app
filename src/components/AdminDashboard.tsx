import { useState, useEffect } from 'react';
import { ref, onValue, set, update } from 'firebase/database';
import { database } from '../firebase';
import type { GameState, Team } from '../types';
import './AdminDashboard.css';

const INITIAL_TEAMS: Record<string, Team> = {
  teamA: { id: 'teamA', name: 'チームA', score: 0, color: '#E8577A' },
  teamB: { id: 'teamB', name: 'チームB', score: 0, color: '#5EBD8E' },
  teamC: { id: 'teamC', name: 'チームC', score: 0, color: '#F6A855' },
};

export default function AdminDashboard() {
  const [gameState, setGameState] = useState<GameState>({
    round: 1,
    teams: INITIAL_TEAMS
  });
  const [selectedPoints, setSelectedPoints] = useState(10);
  const [selectedGame, setSelectedGame] = useState('ゲーム未選択');

  useEffect(() => {
    const gameRef = ref(database, 'game');
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data);
      } else {
        // 初期データがない場合は作成
        const initialState = {
          round: 1,
          teams: INITIAL_TEAMS
        };
        set(gameRef, initialState);
        setGameState(initialState);
      }
    });
    return () => unsubscribe();
  }, []);

  const addPoints = (teamId: string) => {
    const updatedScore = gameState.teams[teamId].score + selectedPoints;
    update(ref(database, `game/teams/${teamId}`), { score: updatedScore });
  };

  const resetScores = () => {
    const resetTeams = { ...gameState.teams };
    Object.keys(resetTeams).forEach(key => {
      resetTeams[key].score = 0;
    });
    set(ref(database, 'game'), {
      round: gameState.round,
      teams: resetTeams
    });
  };

  const updateRound = (round: number) => {
    update(ref(database, 'game'), { round });
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>2025年グランドツー忘年会</h1>
        <p>第{gameState.round}回戦</p>
      </header>

      <div className="admin-content">
        <div className="left-panel">
          {Object.values(gameState.teams).map((team) => (
            <div
              key={team.id}
              className="team-card"
              style={{ backgroundColor: team.color }}
            >
              <div className="team-info">
                <h2>{team.name}</h2>
                <div className="team-score">
                  <span className="score-number">{team.score}</span>
                  <span className="score-label">pts</span>
                </div>
              </div>
              <div className="trophy-icon">🏆</div>
            </div>
          ))}

          <div className="history-section">
            <p>まだ履歴はありません</p>
          </div>
        </div>

        <div className="right-panel">
          <div className="control-section">
            <div className="section-title">
              <span className="icon">📝</span>
            </div>

            <div className="control-row">
              <div className="control-group">
                <label>追加ポイント</label>
                <select
                  className="control-select"
                  value={selectedPoints}
                  onChange={(e) => setSelectedPoints(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="control-group">
                <label>競技 / 種目</label>
                <select
                  className="control-select"
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                >
                  <option>ゲーム未選択</option>
                  <option>ゲーム1</option>
                  <option>ゲーム2</option>
                  <option>ゲーム3</option>
                </select>
              </div>
            </div>

            <div className="team-buttons">
              {Object.values(gameState.teams).map((team) => (
                <button
                  key={team.id}
                  className="team-button"
                  style={{ backgroundColor: team.color }}
                  onClick={() => addPoints(team.id)}
                >
                  {team.name}<br />+{selectedPoints}
                </button>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button className="reset-button" onClick={resetScores}>
              第一回戦
            </button>
            <button className="reset-button" onClick={resetScores}>
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

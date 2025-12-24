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
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

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

  const updatePoints = (teamId: string, isAdd: boolean) => {
    const change = isAdd ? selectedPoints : -selectedPoints;
    const updatedScore = gameState.teams[teamId].score + change;
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

  const startEditTeam = (teamId: string) => {
    const team = gameState.teams[teamId];
    setEditingTeam(teamId);
    setEditName(team.name);
    setEditColor(team.color);
  };

  const saveTeamEdit = () => {
    if (!editingTeam) return;
    update(ref(database, `game/teams/${editingTeam}`), {
      name: editName,
      color: editColor
    });
    setEditingTeam(null);
  };

  const cancelEdit = () => {
    setEditingTeam(null);
    setEditName('');
    setEditColor('');
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>2025年グランドツー忘年会</h1>
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
              <button
                className="edit-team-button"
                onClick={() => startEditTeam(team.id)}
                title="チーム設定を編集"
              >
                ✏️
              </button>
            </div>
          ))}
        </div>

        <div className="right-panel">
          <div className="control-section">
            <div className="section-title">
              <span className="icon">📝</span>
            </div>

            <div className="control-row">
              <div className="control-group">
                <label>ポイント</label>
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
            </div>

            <div className="team-buttons-grid">
              {Object.values(gameState.teams).map((team) => (
                <div key={team.id} className="team-button-row">
                  <span className="team-button-label" style={{ color: team.color }}>
                    {team.name}
                  </span>
                  <div className="team-button-actions">
                    <button
                      className="point-button minus"
                      onClick={() => updatePoints(team.id, false)}
                    >
                      −{selectedPoints}
                    </button>
                    <button
                      className="point-button plus"
                      style={{ backgroundColor: team.color }}
                      onClick={() => updatePoints(team.id, true)}
                    >
                      +{selectedPoints}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="action-buttons">
            <button className="reset-button" onClick={resetScores}>
              リセット
            </button>
          </div>
        </div>
      </div>

      {editingTeam && (
        <div className="edit-modal-overlay" onClick={cancelEdit}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h3>チーム設定</h3>
            <div className="edit-form">
              <div className="edit-field">
                <label>チーム名</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="edit-input"
                />
              </div>
              <div className="edit-field">
                <label>カラー</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="edit-color"
                  />
                  <input
                    type="text"
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="edit-input color-text"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div className="edit-preview">
                <div
                  className="preview-card"
                  style={{ backgroundColor: editColor }}
                >
                  {editName}
                </div>
              </div>
            </div>
            <div className="edit-actions">
              <button className="cancel-button" onClick={cancelEdit}>
                キャンセル
              </button>
              <button className="save-button" onClick={saveTeamEdit}>
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

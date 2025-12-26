import { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../firebase';
import type { GameState } from '../types';
import './TabletDisplay.css';

const teamBackgrounds: Record<string, string> = {
  'teamA': '/gura.png',
  'teamB': '/tanaka.png',
  'teamC': '/obana.png',
};

export default function TabletDisplay() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const gameRef = ref(database, 'game');
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data);
      }
    });
    return () => unsubscribe();
  }, []);

  const updatePoints = (teamId: string, points: number) => {
    if (!gameState) return;
    const updatedScore = gameState.teams[teamId].score + points;
    update(ref(database, `game/teams/${teamId}`), { score: updatedScore });
  };

  if (!gameState) {
    return (
      <div className="tablet-display loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  // スコア順にソート（1位、2位、3位）
  const sortedTeams = Object.values(gameState.teams).sort(
    (a, b) => b.score - a.score
  );

  return (
    <div className="tablet-display">
      <div className="ranking-list">
        {sortedTeams.map((team) => (
          <div
            key={team.id}
            className="ranking-item"
            style={{
              backgroundImage: `url(${teamBackgrounds[team.id]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="ranking-main">
              <span className="team-score">{team.score}</span>
            </div>
            <div className="score-buttons">
              <button onClick={() => updatePoints(team.id, -10)}>−10</button>
              <button onClick={() => updatePoints(team.id, -5)}>−5</button>
              <button onClick={() => updatePoints(team.id, 5)}>+5</button>
              <button onClick={() => updatePoints(team.id, 10)}>+10</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

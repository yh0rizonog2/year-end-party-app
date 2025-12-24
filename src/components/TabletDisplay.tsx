import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';
import type { GameState } from '../types';
import './TabletDisplay.css';

interface TabletDisplayProps {
  teamId: string;
}

export default function TabletDisplay({ teamId }: TabletDisplayProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const gameRef = ref(database, 'game');
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data);
        setIsConnected(true);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!gameState) {
    return (
      <div className="tablet-display loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  const myTeam = gameState.teams[teamId];
  const rivalTeams = Object.values(gameState.teams).filter(
    (team) => team.id !== teamId
  );

  return (
    <div className="tablet-display">
      <header className="tablet-header">
        <h1>2025年グランドツー忘年会</h1>
      </header>

      <div className="tablet-content">
        <div className="my-team-section">
          <p className="section-label">あなたのチーム</p>
          <div
            className="my-team-card"
            style={{ backgroundColor: myTeam.color }}
          >
            <div className="trophy-large">🏆</div>
            <h2>{myTeam.name}</h2>
            <div className="score-display">
              <span className="score-number">{myTeam.score}</span>
              <span className="score-label">pts</span>
            </div>
          </div>
        </div>

        <div className="rivals-section">
          <p className="section-label">ライバルのスコア</p>
          <div className="rivals-cards">
            {rivalTeams.map((team) => (
              <div
                key={team.id}
                className="rival-card"
                style={{ backgroundColor: team.color }}
              >
                <h3>{team.name}</h3>
                <span className="rival-score">{team.score}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {isConnected && (
        <div className="live-indicator">
          <span className="live-dot"></span>
          LIVE SYNCING
        </div>
      )}
    </div>
  );
}

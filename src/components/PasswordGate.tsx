import { useState, useEffect } from 'react';
import './PasswordGate.css';

interface PasswordGateProps {
  children: React.ReactNode;
}

const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD || '2025grand2';

export default function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // ローカルストレージから認証状態を確認
    const auth = localStorage.getItem('year-end-party-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('year-end-party-auth', 'true');
      setError('');
    } else {
      setError('パスワードが違います');
      setPassword('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="password-gate">
      <div className="password-container">
        <p>パスワードを入力してください</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            className="password-input"
            autoFocus
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
}

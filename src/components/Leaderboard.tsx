import { useState, useEffect } from 'react';
import { useScores } from '../hooks/useApi';
import LoadingSpinner from './LoadingSpinner';

interface LeaderboardProps {
  onScoreSaved: () => void;
  attempts?: number | null;
  targetNumber?: number | null;
}

const Leaderboard = ({ onScoreSaved, attempts, targetNumber }: LeaderboardProps) => {
  const { data: scores, loading, error, addScore } = useScores();
  const [playerName, setPlayerName] = useState('');
  const [cachedAttempts, setCachedAttempts] = useState<number | null>(null);
  const [cachedTarget, setCachedTarget] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (attempts != null && targetNumber != null) {
      setCachedAttempts(attempts);
      setCachedTarget(targetNumber);
    }
  }, [attempts, targetNumber]);

  const canSave = cachedAttempts !== null;

  const handleSaveScore = async () => {
    if (!playerName.trim() || cachedAttempts === null || cachedTarget === null) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await addScore(playerName.trim(), cachedAttempts, cachedTarget);
      setCachedAttempts(null);
      setCachedTarget(null);
      setPlayerName('');
      onScoreSaved();
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : '發生錯誤');
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return <p className="api-offline">⚠️ 排行榜需要啟動後端伺服器（npm run server）</p>;
  }

  return (
    <div className="leaderboard">
      <h3>🏆 排行榜</h3>

      {canSave && (
        <div className="save-score">
          <p>🎉 輸入名稱儲存你的成績（{cachedAttempts} 次猜中）！</p>
          <div className="save-score-form">
            <input
              type="text"
              placeholder="輸入名稱"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              maxLength={50}
              disabled={submitting}
            />
            <button onClick={handleSaveScore} disabled={submitting || !playerName.trim()}>
              {submitting ? '儲存中...' : '儲存成績'}
            </button>
          </div>
          {submitError && <p className="form-error">{submitError}</p>}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="載入排行榜..." />
      ) : scores && scores.length > 0 ? (
        <table className="score-table">
          <thead>
            <tr>
              <th>#</th>
              <th>玩家</th>
              <th>猜測次數</th>
              <th>日期</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s.id} className={i < 3 ? `rank-${i + 1}` : ''}>
                <td>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                <td>{s.player_name}</td>
                <td>{s.attempts}</td>
                <td>{new Date(s.created_at).toLocaleDateString('zh-TW')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-scores">尚無成績記錄</p>
      )}
    </div>
  );
};

export default Leaderboard;

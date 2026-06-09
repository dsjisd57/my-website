import { useState, useEffect } from 'react';
import { useScores } from '../hooks/useApi';
import { getLocalScores, addLocalScore } from '../hooks/useLocalStorage';
import LoadingSpinner from './LoadingSpinner';

interface LeaderboardProps {
  onScoreSaved: () => void;
  attempts?: number | null;
  targetNumber?: number | null;
}

const Leaderboard = ({ onScoreSaved, attempts, targetNumber }: LeaderboardProps) => {
  const { data: apiScores, loading, error, addScore } = useScores();
  const [localScores, setLocalScores] = useState(getLocalScores);
  const [usingLocal, setUsingLocal] = useState(false);
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

  useEffect(() => {
    if (error) {
      setUsingLocal(true);
      setLocalScores(getLocalScores());
    }
  }, [error]);

  const scores = usingLocal ? localScores : apiScores;
  const canSave = cachedAttempts !== null;

  const handleSaveScore = async () => {
    if (!playerName.trim() || cachedAttempts === null || cachedTarget === null) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      if (usingLocal) {
        addLocalScore(playerName.trim(), cachedAttempts, cachedTarget);
        setLocalScores(getLocalScores());
      } else {
        await addScore(playerName.trim(), cachedAttempts, cachedTarget);
      }
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

  return (
    <div className="leaderboard">
      <h3>🏆 排行榜</h3>
      {usingLocal && <p className="api-offline">💾 離線模式：成績儲存在瀏覽器本地</p>}

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

      {loading && !usingLocal ? (
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

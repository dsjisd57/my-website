import { useState } from 'react';
import { getLocalScores, addLocalScore } from '../hooks/useLocalStorage';

interface LeaderboardProps {
  onScoreSaved: () => void;
  attempts?: number | null;
  targetNumber?: number | null;
}

const Leaderboard = ({ onScoreSaved, attempts, targetNumber }: LeaderboardProps) => {
  const [scores, setScores] = useState(getLocalScores);
  const [playerName, setPlayerName] = useState('');

  const canSave = attempts != null && targetNumber != null;

  const handleSaveScore = () => {
    if (!playerName.trim() || attempts == null || targetNumber == null) return;
    addLocalScore(playerName.trim(), attempts, targetNumber);
    setScores(getLocalScores());
    setPlayerName('');
    onScoreSaved();
  };

  return (
    <div className="leaderboard">
      <h3>🏆 排行榜</h3>

      {canSave && (
        <div className="save-score">
          <p>🎉 輸入名稱儲存你的成績（{attempts} 次猜中）！</p>
          <div className="save-score-form">
            <input
              type="text"
              placeholder="輸入名稱"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              maxLength={50}
            />
            <button onClick={handleSaveScore} disabled={!playerName.trim()}>
              儲存成績
            </button>
          </div>
        </div>
      )}

      {scores.length > 0 ? (
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

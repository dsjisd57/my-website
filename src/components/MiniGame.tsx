import { useState, useEffect, useCallback } from 'react';
import Leaderboard from './Leaderboard';

const MiniGame = () => {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const startNewGame = useCallback(() => {
    const newNumber = Math.floor(Math.random() * 100) + 1;
    setTargetNumber(newNumber);
    setGuess('');
    setMessage('請輸入 1-100 之間的數字');
    setAttempts(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage('請輸入有效的 1-100 數字！');
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (num === targetNumber) {
      setMessage(`🎉 恭喜！你猜對了！答案是 ${targetNumber}，共猜了 ${newAttempts} 次`);
      setGameOver(true);
    } else if (num < targetNumber) {
      setMessage(`📈 太小了！再試試看 (已猜 ${newAttempts} 次)`);
    } else {
      setMessage(`📉 太大了！再試試看 (已猜 ${newAttempts} 次)`);
    }
    setGuess('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div className="section mini-game">
      <h2>🎮 猜數字小遊戲</h2>
      <div className="game-container">
        <p className="game-description">我想了一個 1-100 的數字，你可以猜看看！</p>
        <div className="game-controls">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="輸入你的猜測"
            disabled={gameOver}
            min="1"
            max="100"
            autoFocus
          />
          <button onClick={handleGuess} disabled={gameOver || !guess}>
            猜！
          </button>
          <button onClick={startNewGame} className="new-game">
            🔄 新遊戲
          </button>
        </div>
        <p className="game-message" role="status" aria-live="polite">{message}</p>
        <p className="attempts">猜測次數：{attempts}</p>

        {gameOver && (
          <div className="game-over-actions">
            <button
              className="view-leaderboard-btn"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
            >
              {showLeaderboard ? '隱藏排行榜' : '🏆 查看排行榜'}
            </button>
          </div>
        )}
      </div>

      {showLeaderboard && (
        <Leaderboard onScoreSaved={() => setShowLeaderboard(true)} />
      )}
    </div>
  );
};

export default MiniGame;

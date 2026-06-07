interface NotFoundProps {
  onBack: () => void;
}

const NotFound = ({ onBack }: NotFoundProps) => (
  <div className="not-found">
    <div className="not-found-content">
      <span className="not-found-icon">🔍</span>
      <h2>404 - 頁面不存在</h2>
      <p>您要找的頁面可能已被移除或不存在。</p>
      <button className="back-button" onClick={onBack}>
        回到首頁
      </button>
    </div>
  </div>
);

export default NotFound;

const LoadingSpinner = ({ text = '載入中...' }: { text?: string }) => (
  <div className="loading-spinner">
    <div className="spinner" />
    <p>{text}</p>
  </div>
);

export default LoadingSpinner;

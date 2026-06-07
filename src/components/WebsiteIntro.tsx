import Guestbook from './Guestbook';

const WebsiteIntro = () => {
  return (
    <div className="section website-intro">
      <h2>網站介紹</h2>
      <div className="content">
        <p>歡迎來到我的個人網站！這是一個使用 React + TypeScript 構建的現代化網站。</p>
        <h3>網站特色</h3>
        <ul>
          <li>使用 React 19 和 TypeScript 開發</li>
          <li>響應式設計，支援各種裝置</li>
          <li>包含互動式小遊戲</li>
          <li>清晰的個人簡介展示</li>
          <li>簡潔美觀的 UI 設計</li>
          <li>留言板與排行榜功能</li>
        </ul>
        <h3>技術棧</h3>
        <p>前端框架：React + TypeScript</p>
        <p>後端框架：Express + SQLite</p>
        <p>建構工具：Vite</p>
        <p>部署平台：GitHub Pages / 自管伺服器</p>
      </div>
      <Guestbook />
    </div>
  );
};

export default WebsiteIntro;

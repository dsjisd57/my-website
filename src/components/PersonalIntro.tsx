const PersonalIntro = () => {
  return (
    <div className="section personal-intro">
      <h2>個人簡介</h2>
      <div className="content">
        <div className="profile">
          <div className="avatar">👤</div>
          <div className="info">
            <h3>姓名：陳大文</h3>
            <p>職稱：前端開發工程師</p>
            <p>所在地：台灣台北</p>
          </div>
        </div>
        <h3>關於我</h3>
        <p>熱愛前端開發，專注於 React、TypeScript 和現代化網頁技術。擁有豐富的網頁開發經驗，致力於創造優質的使用者體驗。</p>
        <h3>技能專長</h3>
        <ul>
          <li>React / React Native</li>
          <li>TypeScript / JavaScript</li>
          <li>HTML5 / CSS3</li>
          <li>Node.js / Express</li>
          <li>Git / GitHub</li>
        </ul>
        <h3>聯絡方式</h3>
        <p>Email: example@email.com</p>
        <p>GitHub: github.com/example</p>
      </div>
    </div>
  );
};

export default PersonalIntro;

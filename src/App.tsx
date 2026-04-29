import { useState } from 'react'
import WebsiteIntro from './components/WebsiteIntro'
import PersonalIntro from './components/PersonalIntro'
import MiniGame from './components/MiniGame'
import './App.css'

type Section = 'website' | 'personal' | 'game'

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('website')

  const renderSection = () => {
    switch (currentSection) {
      case 'website':
        return <WebsiteIntro />
      case 'personal':
        return <PersonalIntro />
      case 'game':
        return <MiniGame />
      default:
        return <WebsiteIntro />
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>我的個人網站</h1>
        <nav className="nav">
          <button
            className={currentSection === 'website' ? 'active' : ''}
            onClick={() => setCurrentSection('website')}
          >
            網站介紹
          </button>
          <button
            className={currentSection === 'personal' ? 'active' : ''}
            onClick={() => setCurrentSection('personal')}
          >
            個人簡介
          </button>
          <button
            className={currentSection === 'game' ? 'active' : ''}
            onClick={() => setCurrentSection('game')}
          >
            小遊戲
          </button>
        </nav>
      </header>
      <main className="main">
        {renderSection()}
      </main>
      <footer className="footer">
        <p>© 2026 我的個人網站 | 使用 React + TypeScript 構建</p>
      </footer>
    </div>
  )
}

export default App

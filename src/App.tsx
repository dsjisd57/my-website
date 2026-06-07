import { useState } from 'react'
import WebsiteIntro from './components/WebsiteIntro'
import PersonalIntro from './components/PersonalIntro'
import MiniGame from './components/MiniGame'
import NotFound from './components/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/Toast'
import './App.css'

type Section = 'website' | 'personal' | 'game'

function App() {
  const [currentSection, setCurrentSection] = useState<Section>('website')
  const [notFound, setNotFound] = useState(false)

  const navigateTo = (section: Section) => {
    setCurrentSection(section)
    setNotFound(false)
  }

  if (notFound) {
    return (
      <ErrorBoundary>
        <ToastProvider>
          <NotFound onBack={() => navigateTo('website')} />
        </ToastProvider>
      </ErrorBoundary>
    )
  }

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
    <ErrorBoundary>
      <ToastProvider>
        <div className="app">
          <header className="header">
            <h1>🌟 我的個人網站</h1>
            <nav className="nav">
              <button
                className={currentSection === 'website' ? 'active' : ''}
                onClick={() => navigateTo('website')}
              >
                網站介紹
              </button>
              <button
                className={currentSection === 'personal' ? 'active' : ''}
                onClick={() => navigateTo('personal')}
              >
                個人簡介
              </button>
              <button
                className={currentSection === 'game' ? 'active' : ''}
                onClick={() => navigateTo('game')}
              >
                小遊戲
              </button>
            </nav>
          </header>
          <main className="main">
            {renderSection()}
          </main>
          <footer className="footer">
            <p>© 2026 我的個人網站 | React + TypeScript + Express + SQLite</p>
          </footer>
        </div>
      </ToastProvider>
    </ErrorBoundary>
  )
}

export default App

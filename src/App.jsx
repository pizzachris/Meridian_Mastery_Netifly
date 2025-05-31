import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import DailySession from './components/DailySession'
import Flashcard from './components/Flashcard'
import BodyMap from './components/BodyMap'
import Settings from './components/Settings'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <Router>
          <Routes>
            <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
            <Route path="/session" element={<DailySession />} />
            <Route path="/flashcards" element={<Flashcard />} />
            <Route path="/bodymap" element={<BodyMap />} />
            <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
          </Routes>
        </Router>
      </div>
    </div>
  )
}

export default App
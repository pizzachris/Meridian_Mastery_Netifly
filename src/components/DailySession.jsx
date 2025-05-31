import React, { useState } from 'react'
import { ProgressTracker } from '../utils/progressTracker'

const DailySession = ({ navigateTo }) => {
  const [selectedMode, setSelectedMode] = useState(null)

  const studyModes = [
    { id: 'meridian', name: 'By Meridian', description: 'Study points organized by meridian pathways' },
    { id: 'region', name: 'By Region', description: 'Study points by body regions' },
    { id: 'theme', name: 'By Theme', description: 'Study points by healing themes' }
  ]
  const hiddenModes = [
    { id: 'maek-chi-ki', name: 'Maek Chi Ki', icon: '👊', description: 'Fist techniques' },
    { id: 'maek-cha-ki', name: 'Maek Cha Ki', icon: '🦶', description: 'Foot techniques' }
  ]

  const handleStartSession = () => {
    if (selectedMode) {
      // Track session completion
      ProgressTracker.completeSession(selectedMode)
      navigateTo('flashcards', { sessionMode: selectedMode })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">        {/* Header */}
        <header className="text-center mb-8">
          <button 
            onClick={() => navigateTo('home')}
            className="inline-block mb-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Daily Session</h1>
          <p className="text-gray-300">Choose your study mode</p>
        </header>        {/* Study Mode Selection Grid */}
        <div className="max-w-lg mx-auto mb-8">
          {/* Top Row: BY REGION */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setSelectedMode('region')}
              className={`px-8 py-3 rounded-lg border transition-all duration-200 ${
                selectedMode === 'region'
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-gray-600 hover:border-gray-500 text-white'
              }`}
            >
              BY REGION
            </button>
          </div>          {/* Middle Row: Hidden Mode + BY THEME + Hidden Mode */}
          <div className="flex justify-between items-center mb-4">            {/* Left Hidden: Maek Chi Ki */}
            <button 
              onClick={() => setSelectedMode('maek-chi-ki')}
              className={`flex flex-col items-center space-y-2 transition-all duration-200 group ${
                selectedMode === 'maek-chi-ki' 
                  ? 'text-red-400' 
                  : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <div className={`relative w-12 h-12 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                selectedMode === 'maek-chi-ki'
                  ? 'border-red-400 shadow-lg shadow-red-400/30'
                  : 'border-red-700 group-hover:border-red-500'
              }`}>
                {/* Triple spiral background pattern */}
                <div className="absolute inset-1 rounded-full border border-red-600/30"></div>
                <div className="absolute inset-2 rounded-full border border-red-500/20"></div>
                {/* Fist icon */}
                <span className="text-xl">👊</span>
              </div>
              <span className="text-xs font-medium">MAEK CHI KI</span>
            </button>

            {/* Center: BY THEME */}
            <button
              onClick={() => setSelectedMode('theme')}
              className={`px-8 py-3 rounded-lg border transition-all duration-200 ${
                selectedMode === 'theme'
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-gray-600 hover:border-gray-500 text-white'
              }`}
            >
              BY THEME
            </button>            {/* Right Hidden: Maek Cha Ki */}
            <button 
              onClick={() => setSelectedMode('maek-cha-ki')}
              className={`flex flex-col items-center space-y-2 transition-all duration-200 group ${
                selectedMode === 'maek-cha-ki' 
                  ? 'text-red-400' 
                  : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <div className={`relative w-12 h-12 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                selectedMode === 'maek-cha-ki'
                  ? 'border-red-400 shadow-lg shadow-red-400/30'
                  : 'border-red-700 group-hover:border-red-500'
              }`}>
                {/* Triple spiral background pattern */}
                <div className="absolute inset-1 rounded-full border border-red-600/30"></div>
                <div className="absolute inset-2 rounded-full border border-red-500/20"></div>
                {/* Foot icon */}
                <span className="text-xl">🦶</span>
              </div>
              <span className="text-xs font-medium">MAEK CHA KI</span>
            </button>
          </div>

          {/* Bottom Row: BY MERIDIAN */}
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedMode('meridian')}
              className={`px-8 py-3 rounded-lg border transition-all duration-200 ${
                selectedMode === 'meridian'
                  ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                  : 'border-gray-600 hover:border-gray-500 text-white'
              }`}
            >
              BY MERIDIAN
            </button>
          </div>
        </div>

        {/* Meridian Selection (when BY MERIDIAN is selected) */}
        {selectedMode === 'meridian' && (
          <div className="max-w-md mx-auto mb-8">
            <p className="text-center text-yellow-400 mb-4">Select a meridian to train.</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                'Lung', 'Large Intestine', 'Stomach', 'Spleen', 'Heart', 'Small Intestine',
                'Urinary Bladder', 'Kidney', 'Pericardium', 'Triple Burner', 'Gall Bladder', 'Liver'
              ].map((meridian) => (
                <button
                  key={meridian}
                  onClick={() => setSelectedMode(`meridian-${meridian.toLowerCase().replace(' ', '-')}`)}
                  className="py-2 px-3 text-yellow-400 hover:text-yellow-300 border border-yellow-400/30 rounded hover:border-yellow-400/60 transition-all duration-200"
                >
                  {meridian}
                </button>
              ))}
            </div>
          </div>
        )}        {/* Start Button */}
        {selectedMode && (
          <div className="max-w-md mx-auto space-y-3">
            <button 
              onClick={handleStartSession}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200"
            >
              BEGIN FLASHCARDS
            </button>
            
            <button 
              onClick={() => {
                ProgressTracker.completeSession(`quiz-${selectedMode}`)
                navigateTo('quiz', { sessionMode: selectedMode })
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200"
            >
              🧠 START QUIZ MODE
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DailySession
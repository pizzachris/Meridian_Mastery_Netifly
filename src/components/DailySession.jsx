import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const DailySession = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <button className="text-yellow-400 hover:text-yellow-300 text-sm font-medium">
              ← Back to Home
            </button>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Daily Session</h1>
          <p className="text-gray-300">Choose your study mode</p>
        </header>

        {/* Study Modes */}
        <div className="max-w-md mx-auto space-y-4 mb-8">
          {studyModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedMode === mode.id
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <h3 className="font-semibold text-lg">{mode.name}</h3>
              <p className="text-gray-400 text-sm">{mode.description}</p>
            </button>
          ))}
        </div>

        {/* Hidden Modes */}
        <div className="max-w-md mx-auto grid grid-cols-2 gap-4 mb-8">
          {hiddenModes.map((mode) => (
            <button
              key={mode.id}
              className="p-4 rounded-2xl border border-gray-600 hover:border-red-500 transition-all duration-200 text-center"
            >
              <div className="text-2xl mb-2">{mode.icon}</div>
              <div className="text-sm font-medium">{mode.name}</div>
            </button>
          ))}
        </div>

        {/* Start Button */}
        {selectedMode && (
          <div className="max-w-md mx-auto">
            <Link to="/flashcards">
              <button className="w-full btn-primary text-xl py-4">
                Start Session
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default DailySession
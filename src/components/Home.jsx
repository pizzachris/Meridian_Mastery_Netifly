import React from 'react'
import { Link } from 'react-router-dom'

const Home = ({ darkMode, setDarkMode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="mb-6">
            {/* Gold Triskele Spiral Emblem Placeholder */}
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
              <div className="text-black text-2xl font-bold">MM</div>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Meridian Mastery
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light">
            Master your meridians.
          </p>
        </header>

        {/* Main Navigation */}
        <div className="max-w-md mx-auto space-y-6">
          <Link to="/session" className="block">
            <button className="w-full btn-primary text-xl py-4">
              Start Session
            </button>
          </Link>

          <div className="grid grid-cols-1 gap-4">
            <Link to="/flashcards" className="block">
              <button className="w-full btn-secondary">
                Flashcards
              </button>
            </Link>
            
            <Link to="/bodymap" className="block">
              <button className="w-full btn-secondary">
                Body Map
              </button>
            </Link>
            
            <Link to="/settings" className="block">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200">
                Settings
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400">
          <p className="text-sm">
            Based on traditional Korean/TCM principles<br />
            Master R. Barry Harmon's pressure point manual
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Home
import React from 'react'

const Home = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="mb-6">
            {/* SVG Logo */}
            <div className="w-32 h-32 mx-auto">
              <img 
                src="/meridian_mastery_logo.svg" 
                alt="Meridian Mastery Logo" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Meridian Mastery
          </h1>
          <p className="text-lg text-yellow-400 font-medium">
            국술원 • Kuk Sool Won Pressure Points
          </p>
        </header>

        {/* Main Navigation */}
        <div className="max-w-md mx-auto space-y-6">
          <button 
            onClick={() => navigateTo('session')}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 text-xl"
          >
            Start Session
          </button>          <div className="grid grid-cols-1 gap-4">
            <button 
              onClick={() => navigateTo('flashcards')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Flashcards
            </button>
              <button 
              onClick={() => navigateTo('quiz-selection')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              🧠 Quiz Mode
            </button>
              <button 
              onClick={() => navigateTo('bodymap')}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Body Map
            </button>
            
            <button 
              onClick={() => navigateTo('progress')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              Progress
            </button>
            
            <button 
              onClick={() => navigateTo('settings')}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200"
            >
              Settings
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400">
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-4">
            Master your meridians.
          </p>
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
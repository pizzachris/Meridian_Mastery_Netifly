import React from 'react'

const Home = ({ navigateTo }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white korean-flow-pattern yin-yang-flow">
      <div className="container mx-auto px-4 py-6 sm:py-8">        {/* Header with Korean Aesthetic - Enhanced Mobile */}
        <header className="text-center mb-6 sm:mb-12 relative px-2">
          <div className="mb-3 sm:mb-6 relative">
            {/* Energy Circles around Logo - Smaller on mobile */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-40 sm:h-40 rounded-full border border-yellow-400/20 animate-pulse"></div>
              <div className="absolute w-24 h-24 sm:w-48 sm:h-48 rounded-full border border-red-400/10 animate-ping"></div>
            </div>
            
            {/* SVG Logo - Optimized for mobile */}
            <div className="w-16 h-16 sm:w-32 sm:h-32 mx-auto relative z-10">
              <img 
                src="/meridian_mastery_logo.svg" 
                alt="Meridian Mastery Logo" 
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-1 sm:mb-4 bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-600 bg-clip-text text-transparent leading-tight">
            Meridian Mastery
          </h1>
          <p className="text-sm sm:text-lg text-yellow-400 font-medium mb-2 px-2">
            국술원 • Kuk Sool Won Pressure Points
          </p>
          <div className="w-20 sm:w-24 h-1 mx-auto bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"></div>
        </header>        {/* Main Navigation with Five Elements Flow - Better Mobile Layout */}
        <div className="max-w-xs sm:max-w-md mx-auto space-y-3 sm:space-y-6 px-2">
          <button 
            onClick={() => navigateTo('session')}
            className="w-full btn-primary text-base sm:text-xl relative overflow-hidden group py-4"
          >
            <span className="relative z-10">🥋 Start Daily Session</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-red-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>

          <div className="grid grid-cols-1 gap-2 sm:gap-4">            {/* Wood Element - Growth & Learning */}
            <button 
              onClick={() => navigateTo('flashcards', { sessionMode: 'all' })}
              className="w-full element-wood font-semibold py-4 px-3 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
            >
              <span className="relative z-10">🌿 Flashcards</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-300/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
            
            {/* Fire Element - Energy & Testing */}
            <button 
              onClick={() => navigateTo('quiz-selection')}
              className="w-full element-fire font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
            >
              <span className="relative z-10">🔥 Quiz Mode</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-300/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
            
            {/* Water Element - Flow & Mapping */}
            <button 
              onClick={() => navigateTo('bodymap')}
              className="w-full element-water font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
            >
              <span className="relative z-10">💧 Body Map</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
            
            {/* Earth Element - Foundation & Progress */}
            <button 
              onClick={() => navigateTo('progress')}
              className="w-full element-earth font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
            >
              <span className="relative z-10">🌍 Progress</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
            
            {/* Metal Element - Structure & Settings */}
            <button 
              onClick={() => navigateTo('settings')}
              className="w-full element-metal font-semibold py-3 px-4 sm:px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base relative group"
            >
              <span className="relative z-10">⚙️ Settings</span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-300/20 to-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </button>
          </div>
        </div>

        {/* Korean Traditional Footer with Five Elements Flow */}
        <footer className="mt-12 sm:mt-16 text-center text-gray-400 px-4 relative">
          {/* Traditional Korean Decoration */}
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
            </div>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-light mb-2 sm:mb-4">
            Master your meridians.
          </p>
          <p className="text-xs sm:text-sm">
            Based on traditional Korean/TCM principles<br />
            Master R. Barry Harmon's pressure point manual
          </p>
        </footer>
      </div>
    </div>
  )
}

export default Home
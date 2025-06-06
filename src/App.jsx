import React, { useState, useEffect, Suspense } from 'react'
import Home from './components/Home'
import DisclaimerModal from './components/DisclaimerModal'

// Lazy load components for better performance
const DailySession = React.lazy(() => import('./components/DailySession'))
const Flashcard = React.lazy(() => import('./components/Flashcard'))
const BodyMap = React.lazy(() => import('./components/BodyMap'))
const Settings = React.lazy(() => import('./components/Settings'))
const Progress = React.lazy(() => import('./components/Progress'))
const Quiz = React.lazy(() => import('./components/Quiz'))
const QuizSelection = React.lazy(() => import('./components/QuizSelection'))
const FlaggedIssues = React.lazy(() => import('./components/FlaggedIssues'))

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [currentPage, setCurrentPage] = useState('home')
  const [sessionMode, setSessionMode] = useState(null)
  const [shuffleMode, setShuffleMode] = useState(false)
  const [quizOptions, setQuizOptions] = useState(null)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  
  // Check if user has seen disclaimer on first load
  useEffect(() => {
    const hasSeenDisclaimer = localStorage.getItem('meridian-mastery-disclaimer-accepted')
    if (!hasSeenDisclaimer) {
      setShowDisclaimer(true)
    }
  }, [])
  
  // Handle disclaimer acceptance
  const handleDisclaimerAccept = () => {
    localStorage.setItem('meridian-mastery-disclaimer-accepted', 'true')
    localStorage.setItem('meridian-mastery-disclaimer-date', new Date().toISOString())
    setShowDisclaimer(false)
  }  // Navigation function
  const navigateTo = (page, options = {}) => {
    setCurrentPage(page)
    if (options.sessionMode) {
      setSessionMode(options.sessionMode)
    } else if (page === 'flashcards' && !options.sessionMode) {
      // Default flashcards to 'all' mode (pressure points only, no Hohn Soo)
      setSessionMode('all')
    }
    if (options.shuffleMode !== undefined) {
      setShuffleMode(options.shuffleMode)
    }
    if (options.quizType) {
      setQuizOptions(options)
    }
    
    // Handle scrollTo option for smooth navigation to specific sections
    if (options.scrollTo) {
      // Use setTimeout to ensure the page has rendered before scrolling
      setTimeout(() => {
        const element = document.getElementById(options.scrollTo)
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          })
        }
      }, 100)
    }
  }
  // Render current page component
  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />
      case 'session':
        return <DailySession navigateTo={navigateTo} />
      case 'flashcards':
        return <Flashcard navigateTo={navigateTo} sessionMode={sessionMode} shuffleMode={shuffleMode} />
      case 'bodymap':
        return <BodyMap navigateTo={navigateTo} />
      case 'quiz-selection':
        return <QuizSelection navigateTo={navigateTo} />
      case 'quiz':
        return <Quiz navigateTo={navigateTo} sessionMode={sessionMode} quizOptions={quizOptions} />
      case 'progress':
        return <Progress navigateTo={navigateTo} />
      case 'settings':
        return <Settings navigateTo={navigateTo} darkMode={darkMode} setDarkMode={setDarkMode} />
      case 'flagged-issues':
        return <FlaggedIssues navigateTo={navigateTo} />
      default:
        return <Home navigateTo={navigateTo} />
    }
  }
  // Loading component for lazy-loaded routes
  const LoadingSpinner = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-yellow-400">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        <Suspense fallback={<LoadingSpinner />}>
          {renderCurrentPage()}
        </Suspense>
      </div>
      
      {/* Disclaimer Modal */}
      <DisclaimerModal 
        isOpen={showDisclaimer} 
        onAccept={handleDisclaimerAccept} 
      />
    </div>
  )
}

export default App
import React, { useState, useEffect, useMemo } from 'react'
import { ProgressTracker } from '../utils/progressTracker'
import Logo from './Logo'

const Progress = ({ navigateTo }) => {
  const [progressData, setProgressData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProgress = useCallback(async () => {
    try {
      console.log('🎯 Progress component: Starting to load progress...')
      setIsLoading(true)
      setError(null)
      const currentProgress = await ProgressTracker.getProgress()
      console.log('🎯 Progress component: Loaded progress data:', currentProgress)
      setProgressData(currentProgress)
    } catch (error) {
      console.error('🎯 Progress component: Failed to load progress:', error)
      setError(error.message)
      // Set default progress data if loading fails
      setProgressData({
        studiedPoints: {},
        meridianProgress: {},
        totalQuizAttempts: 0,
        retentionScores: {}
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProgress()
    
    // Reduced frequency: refresh only every 10 seconds instead of 2
    // Progress doesn't change that frequently
    const refreshInterval = setInterval(loadProgress, 10000)
    
    return () => clearInterval(refreshInterval)
  }, [loadProgress])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-gold">Loading progress...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="mb-4">Failed to load progress: {error}</p>
          <button 
            onClick={loadProgress}
            className="bg-gold text-dark px-4 py-2 rounded-lg hover:bg-yellow-400"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>No progress data available</p>
        </div>
      </div>
    )
  }

  const getProgressPercentage = (current, total) => {
    return Math.round((current / total) * 100)
  }

  const getProgressBarWidth = (current, total) => {
    return `${(current / total) * 100}%`
  }

  // Calculate total points studied - with safety checks
  const studiedPointsData = progressData.studiedPoints || {}
  const totalPoints = Math.max(Object.keys(studiedPointsData).length, 1) // Avoid division by zero
  const pointsStudied = Object.values(studiedPointsData).filter(p => p && p.studyCount > 0).length

  // Calculate total meridians progress - with safety checks
  const meridianData = progressData.meridianProgress || {}
  const meridians = Object.entries(meridianData)
  const totalMeridians = Math.max(meridians.length, 1) // Avoid division by zero
  const completedMeridians = meridians.filter(([_, data]) => data && data.masteryLevel >= 70).length

  // Calculate retention scores with safety checks
  const retentionData = progressData.retentionScores || {}
  const retentionValues = Object.values(retentionData).filter(score => typeof score === 'number')
  const averageRetention = retentionValues.length > 0 
    ? Math.round(retentionValues.reduce((a, b) => a + b, 0) / retentionValues.length)
    : 0

  console.log('🎯 Progress calculations:', {
    totalPoints,
    pointsStudied,
    totalMeridians,
    completedMeridians,
    averageRetention,
    totalQuizAttempts: progressData.totalQuizAttempts || 0
  })

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center py-8">
      <div className="w-20 h-20 mb-6 flex items-center justify-center">
        <button onClick={() => navigateTo('home')} aria-label="Go to Home">
          <Logo />
        </button>
      </div>
      <h2 className="text-3xl font-serif font-bold text-gold mb-8 uppercase tracking-wide">Progress</h2>
      <div className="w-full max-w-sm space-y-6">
        {/* Points Studied */}
        <div className="bg-dark border-2 border-gold rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gold font-serif font-bold text-lg">Points Studied</span>
            <span className="text-gold font-sans font-bold">{pointsStudied} / {totalPoints}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 border border-gold">
            <div
              className="bg-deepred h-3 rounded-full"
              style={{ width: getProgressBarWidth(pointsStudied, totalPoints) }}
            />
          </div>
        </div>

        {/* Meridians */}
        <div className="bg-dark border-2 border-gold rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gold font-serif font-bold text-lg">Meridians</span>
            <span className="text-gold font-sans font-bold">{completedMeridians} / {totalMeridians}</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 border border-gold">
            <div
              className="bg-deepred h-3 rounded-full"
              style={{ width: getProgressBarWidth(completedMeridians, totalMeridians) }}
            />
          </div>
        </div>

        {/* Quiz Performance */}
        <div className="bg-dark border-2 border-gold rounded-xl p-4 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gold font-serif font-bold text-lg">Quiz Mastery</span>
            <span className="text-gold font-sans font-bold">{progressData.totalQuizAttempts || 0} Attempts</span>
          </div>
          <div className="text-gray-400 text-sm">
            Average Retention: {averageRetention}%
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gold font-sans text-lg">Progress comes with practice.</div>
    </div>
  )
}

export default Progress

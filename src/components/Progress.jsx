import React, { useState, useEffect } from 'react'
import { ProgressTracker } from '../utils/progressTracker'
import TriskelionLogo from './TriskelionLogo'

const Progress = ({ navigateTo }) => {
  const [progressData, setProgressData] = useState(null)

  useEffect(() => {
    const loadProgress = () => {
      const currentProgress = ProgressTracker.getProgress()
      setProgressData(currentProgress)
    }

    loadProgress()
    
    // Set up an interval to refresh progress every few seconds while on this screen
    const refreshInterval = setInterval(loadProgress, 2000)
    
    return () => clearInterval(refreshInterval)
  }, [])

  if (!progressData) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    )
  }

  const getProgressPercentage = (current, total) => {
    return Math.round((current / total) * 100)
  }

  const getProgressBarWidth = (current, total) => {
    return `${(current / total) * 100}%`
  }

  // Calculate total points studied
  const totalPoints = Object.keys(progressData.studiedPoints).length
  const pointsStudied = Object.values(progressData.studiedPoints).filter(p => p.studyCount > 0).length

  // Calculate total meridians progress
  const meridians = Object.entries(progressData.meridianProgress)
  const totalMeridians = meridians.length
  const completedMeridians = meridians.filter(([_, data]) => data.masteryLevel >= 70).length

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center py-8">
      <div className="w-20 h-20 mb-6 flex items-center justify-center">
        <button onClick={() => navigateTo('home')} aria-label="Go to Home">
          <TriskelionLogo size={80} />
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
            <span className="text-gold font-sans font-bold">{progressData.totalQuizAttempts} Attempts</span>
          </div>
          <div className="text-gray-400 text-sm">
            Average Retention: {
              Object.values(progressData.retentionScores).length > 0 
                ? Math.round(Object.values(progressData.retentionScores).reduce((a, b) => a + b, 0) / Object.values(progressData.retentionScores).length)
                : 0
            }%
          </div>
        </div>
      </div>
      <div className="mt-8 text-center text-gold font-sans text-lg">Progress comes with practice.</div>
    </div>
  )
}

export default Progress

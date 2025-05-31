// Progress tracking utility for Meridian Mastery app
import flashcardsData from '../data/flashcards.json'

export class ProgressTracker {  static getProgress() {
    const savedProgress = localStorage.getItem('meridian-mastery-progress')
    if (savedProgress) {
      const parsed = JSON.parse(savedProgress)
      return {
        ...parsed,
        studiedPoints: new Set(parsed.studiedPoints || []),
        completedSessions: new Set(parsed.completedSessions || []),
        studiedMeridians: new Set(parsed.studiedMeridians || []),
        masteredPoints: new Set(parsed.masteredPoints || []),
        quizAttempts: new Map(parsed.quizAttempts || []),
        retentionScores: new Map(parsed.retentionScores || [])
      }
    }
    return this.initializeProgress()
  }
  static initializeProgress() {
    const allMeridians = [...new Set(flashcardsData.flashcards.map(card => card.meridian))]
    const totalPoints = flashcardsData.flashcards.length
    
    return {
      dailySessions: { current: 0, total: 21 },
      meridians: { current: 0, total: allMeridians.length },
      maekChiKi: { current: 0, total: Math.min(30, totalPoints) },
      studiedPoints: new Set(),
      completedSessions: new Set(),
      studiedMeridians: new Set(),
      quizAttempts: new Map(), // pointId -> { correct: number, incorrect: number, lastAttempt: timestamp }
      masteredPoints: new Set(), // points with high quiz success rate
      retentionScores: new Map() // pointId -> retention percentage (0-100)
    }
  }
  static saveProgress(progressData) {
    const dataToSave = {
      ...progressData,
      studiedPoints: Array.from(progressData.studiedPoints || []),
      completedSessions: Array.from(progressData.completedSessions || []),
      studiedMeridians: Array.from(progressData.studiedMeridians || []),
      masteredPoints: Array.from(progressData.masteredPoints || []),
      quizAttempts: Array.from(progressData.quizAttempts?.entries() || []),
      retentionScores: Array.from(progressData.retentionScores?.entries() || [])
    }
    localStorage.setItem('meridian-mastery-progress', JSON.stringify(dataToSave))
  }

  // Track when a user studies a flashcard point
  static studyPoint(pointId, meridian) {
    const progress = this.getProgress()
    
    // Add point to studied points
    progress.studiedPoints.add(pointId)
    
    // Add meridian to studied meridians
    progress.studiedMeridians.add(meridian)
    
    // Update counts
    progress.maekChiKi.current = Math.min(progress.studiedPoints.size, progress.maekChiKi.total)
    progress.meridians.current = progress.studiedMeridians.size
    
    this.saveProgress(progress)
    return progress
  }

  // Track when a user completes a daily session
  static completeSession(sessionType = 'general') {
    const progress = this.getProgress()
    const today = new Date().toDateString()
    const sessionKey = `${today}-${sessionType}`
    
    // Add session to completed sessions (one per day)
    if (!progress.completedSessions.has(today)) {
      progress.completedSessions.add(today)
      progress.dailySessions.current = Math.min(
        progress.completedSessions.size, 
        progress.dailySessions.total
      )
    }
    
    this.saveProgress(progress)
    return progress
  }

  // Track when user views a point in body map
  static viewPoint(pointId, meridian) {
    return this.studyPoint(pointId, meridian)
  }

  // Get progress statistics
  static getStats() {
    const progress = this.getProgress()
    return {
      totalPointsStudied: progress.studiedPoints.size,
      totalMeridiansStudied: progress.studiedMeridians.size,
      totalSessionsCompleted: progress.completedSessions.size,
      percentageComplete: {
        dailySessions: Math.round((progress.dailySessions.current / progress.dailySessions.total) * 100),
        meridians: Math.round((progress.meridians.current / progress.meridians.total) * 100),
        maekChiKi: Math.round((progress.maekChiKi.current / progress.maekChiKi.total) * 100)
      }
    }
  }
  // Reset progress (for testing or user request)
  static resetProgress() {
    localStorage.removeItem('meridian-mastery-progress')
    return this.initializeProgress()
  }

  // Track quiz attempts and calculate retention
  static recordQuizAttempt(pointId, isCorrect, meridian) {
    const progress = this.getProgress()
    
    // Get existing attempts or initialize
    const attempts = progress.quizAttempts.get(pointId) || { correct: 0, incorrect: 0, lastAttempt: Date.now() }
    
    // Update attempts
    if (isCorrect) {
      attempts.correct++
    } else {
      attempts.incorrect++
    }
    attempts.lastAttempt = Date.now()
    
    // Save attempts
    progress.quizAttempts.set(pointId, attempts)
    
    // Calculate retention score (percentage correct out of total attempts)
    const totalAttempts = attempts.correct + attempts.incorrect
    const retentionScore = Math.round((attempts.correct / totalAttempts) * 100)
    progress.retentionScores.set(pointId, retentionScore)
    
    // Mark as mastered if high retention score (80%+) and at least 3 attempts
    if (retentionScore >= 80 && totalAttempts >= 3) {
      progress.masteredPoints.add(pointId)
      progress.studiedMeridians.add(meridian)
    }
    
    // Update overall progress
    progress.maekChiKi.current = Math.min(progress.masteredPoints.size, progress.maekChiKi.total)
    progress.meridians.current = progress.studiedMeridians.size
    
    this.saveProgress(progress)
    return progress
  }

  // Get quiz statistics for a specific point
  static getQuizStats(pointId) {
    const progress = this.getProgress()
    const attempts = progress.quizAttempts.get(pointId)
    const retentionScore = progress.retentionScores.get(pointId) || 0
    const isMastered = progress.masteredPoints.has(pointId)
    
    return {
      attempts: attempts || { correct: 0, incorrect: 0 },
      retentionScore,
      isMastered,
      totalAttempts: attempts ? attempts.correct + attempts.incorrect : 0
    }
  }

  // Get points that need review (low retention scores)
  static getPointsNeedingReview() {
    const progress = this.getProgress()
    const needsReview = []
    
    progress.retentionScores.forEach((score, pointId) => {
      if (score < 70) { // Points with less than 70% retention
        needsReview.push(pointId)
      }
    })
    
    return needsReview
  }

  // Generate enhanced GPT insights based on user performance
  static generateInsight(pointData, userStats) {
    const baseInsight = pointData.insight || "This is a significant pressure point with both healing and martial applications."
    
    if (!userStats || userStats.totalAttempts === 0) {
      return `${baseInsight} Start by memorizing the Korean name "${pointData.nameHangul}" (${pointData.nameRomanized}) and its primary function: ${pointData.healingFunction}`
    }
    
    if (userStats.isMastered) {
      return `Excellent mastery! You've achieved ${userStats.retentionScore}% retention on ${pointData.nameHangul}. Focus on practical application: ${pointData.martialApplication}. Consider teaching this point to reinforce your knowledge.`
    }
    
    if (userStats.retentionScore < 50) {
      return `This point needs more attention. ${pointData.nameHangul} (${pointData.nameRomanized}) is on the ${pointData.meridian} meridian. Create a memory palace: visualize the location "${pointData.location}" and associate it with "${pointData.healingFunction}".`
    }
    
    if (userStats.retentionScore < 70) {
      return `Good progress on ${pointData.nameHangul}! You're at ${userStats.retentionScore}% retention. Focus on the connection between the ${pointData.element} element and its function: ${pointData.healingFunction}. Practice the martial application: ${pointData.martialApplication}`
    }
    
    return `${baseInsight} Your retention is ${userStats.retentionScore}%. Continue practicing to achieve mastery.`
  }
}

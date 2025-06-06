// Progress tracking utility for Meridian Mastery app
import { getAllPoints } from './dataLoader'

// Load progress from localStorage
const loadProgress = () => {
  const savedProgress = localStorage.getItem('meridianMasteryProgress');
  return savedProgress ? JSON.parse(savedProgress) : {
    points: {},
    sessions: [],
    mastery: {}
  };
};

// Save progress to localStorage
const saveProgress = (progress) => {
  localStorage.setItem('meridianMasteryProgress', JSON.stringify(progress));
};

// Update point progress
export const updatePointProgress = (pointId, isCorrect) => {
  const progress = loadProgress();
  
  if (!progress.points[pointId]) {
    progress.points[pointId] = {
      correct: 0,
      incorrect: 0,
      lastAttempt: null,
      mastery: 0
    };
  }

  const point = progress.points[pointId];
  point.correct += isCorrect ? 1 : 0;
  point.incorrect += isCorrect ? 0 : 1;
  point.lastAttempt = new Date().toISOString();
  point.mastery = calculateMastery(point.correct, point.incorrect);

  saveProgress(progress);
  return point;
};

// Record a training session
export const recordSession = (sessionData) => {
  const progress = loadProgress();
  
  progress.sessions.push({
    ...sessionData,
    timestamp: new Date().toISOString()
  });

  saveProgress(progress);
  return progress.sessions;
};

// Calculate mastery level (0-100)
const calculateMastery = (correct, incorrect) => {
  const total = correct + incorrect;
  if (total === 0) return 0;
  
  // Weight recent attempts more heavily
  const baseScore = (correct / total) * 100;
  
  // Bonus for consistency (more attempts)
  const consistencyBonus = Math.min(total * 2, 20);
  
  return Math.min(baseScore + consistencyBonus, 100);
};

// Get mastery level for a point
export const getPointMastery = (pointId) => {
  const progress = loadProgress();
  return progress.points[pointId]?.mastery || 0;
};

// Get mastery level for a meridian
export const getMeridianMastery = (meridian) => {
  const progress = loadProgress();
  const meridianPoints = Object.entries(progress.points)
    .filter(([_, data]) => data.meridian === meridian);
  
  if (meridianPoints.length === 0) return 0;
  
  const totalMastery = meridianPoints.reduce((sum, [_, data]) => sum + data.mastery, 0);
  return totalMastery / meridianPoints.length;
};

// Get mastery level for a region
export const getRegionMastery = (region) => {
  const progress = loadProgress();
  const regionPoints = Object.entries(progress.points)
    .filter(([_, data]) => data.region === region);
  
  if (regionPoints.length === 0) return 0;
  
  const totalMastery = regionPoints.reduce((sum, [_, data]) => sum + data.mastery, 0);
  return totalMastery / regionPoints.length;
};

// Get session history
export const getSessionHistory = () => {
  const progress = loadProgress();
  return progress.sessions;
};

// Get points that need review
export const getPointsForReview = () => {
  const progress = loadProgress();
  const now = new Date();
  
  return Object.entries(progress.points)
    .filter(([_, data]) => {
      if (!data.lastAttempt) return true;
      
      const lastAttempt = new Date(data.lastAttempt);
      const daysSinceLastAttempt = (now - lastAttempt) / (1000 * 60 * 60 * 24);
      
      // Review points that:
      // 1. Haven't been attempted in 7 days
      // 2. Have low mastery (< 70%)
      return daysSinceLastAttempt >= 7 || data.mastery < 70;
    })
    .map(([id, data]) => ({
      id,
      ...data
    }));
};

// Get mastery insights
export const generateInsight = (point, userStats) => {
  if (!userStats) return null;

  const mastery = userStats.mastery || 0;
  const attempts = userStats.attempts || { correct: 0, total: 0 };
  const accuracy = attempts.total > 0 ? (attempts.correct / attempts.total) * 100 : 0;

  if (mastery >= 90) {
    return "Mastered! Keep reviewing to maintain your knowledge.";
  } else if (mastery >= 70) {
    return "Good progress! Focus on consistency to reach mastery.";
  } else if (accuracy >= 60) {
    return "You're improving! Keep practicing to build confidence.";
  } else {
    return "This point needs more attention. Review the location and applications.";
  }
};

export class ProgressTracker {
  static STORAGE_KEY = 'meridian-mastery-progress'
  static RETENTION_THRESHOLD = 0.7 // 70% retention score required to consider a point mastered

  static getProgress() {
    try {
      const progress = localStorage.getItem(this.STORAGE_KEY)
      const parsed = progress ? JSON.parse(progress) : this.initializeProgress()
      
      // Ensure backward compatibility - add missing fields
      if (!parsed.sessionHistory) {
        parsed.sessionHistory = []
      }
      if (!parsed.studiedPoints) {
        parsed.studiedPoints = {}
      }
      if (!parsed.meridianProgress) {
        parsed.meridianProgress = {}
      }
      
      return parsed
    } catch (error) {
      console.error('Error loading progress, resetting:', error)
      // If there's an error, reset and return fresh progress
      localStorage.removeItem(this.STORAGE_KEY)
      return this.initializeProgress()
    }
  }

  static initializeProgress() {
    const points = getAllPoints()
    const initialProgress = {
      studiedPoints: {},
      lastSessionDate: null,
      totalSessions: 0,
      totalQuizAttempts: 0,
      meridianProgress: {},
      retentionScores: {},
      masteryLevels: {},
      sessionHistory: []
    }

    // Initialize progress for each point
    points.forEach(point => {
      initialProgress.studiedPoints[point.id] = {
        lastStudied: null,
        studyCount: 0,
        quizAttempts: 0,
        correctAnswers: 0
      }
      initialProgress.retentionScores[point.id] = 0
      initialProgress.masteryLevels[point.id] = 0
    })

    // Initialize meridian progress
    const meridians = [...new Set(points.map(p => p.meridian))]
    meridians.forEach(meridian => {
      initialProgress.meridianProgress[meridian] = {
        pointsStudied: 0,
        totalPoints: points.filter(p => p.meridian === meridian).length,
        masteryLevel: 0
      }
    })

    this.saveProgress(initialProgress)
    return initialProgress
  }

  static saveProgress(progress) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress))
  }

  static studyPoint(pointId, meridian) {
    const progress = this.getProgress()
    const now = new Date().toISOString()

    // Update point progress
    if (!progress.studiedPoints[pointId]) {
      progress.studiedPoints[pointId] = {
        lastStudied: null,
        studyCount: 0,
        quizAttempts: 0,
        correctAnswers: 0
      }
    }

    progress.studiedPoints[pointId].lastStudied = now
    progress.studiedPoints[pointId].studyCount++

    // Update meridian progress
    if (meridian && progress.meridianProgress[meridian]) {
      progress.meridianProgress[meridian].pointsStudied = Object.values(progress.studiedPoints)
        .filter(p => getAllPoints().find(ap => ap.id === pointId)?.meridian === meridian)
        .length
    }

    this.saveProgress(progress)
  }

  static recordQuizAttempt(pointId, isCorrect, meridian) {
    const progress = this.getProgress()
    const now = new Date().toISOString()

    // Initialize point progress if needed
    if (!progress.studiedPoints[pointId]) {
      progress.studiedPoints[pointId] = {
        lastStudied: null,
        studyCount: 0,
        quizAttempts: 0,
        correctAnswers: 0
      }
    }

    // Update point progress
    progress.studiedPoints[pointId].quizAttempts++
    if (isCorrect) {
      progress.studiedPoints[pointId].correctAnswers++
    }

    // Update retention score
    const point = progress.studiedPoints[pointId]
    const retentionScore = point.quizAttempts > 0 
      ? point.correctAnswers / point.quizAttempts 
      : 0
    progress.retentionScores[pointId] = retentionScore

    // Update mastery level
    progress.masteryLevels[pointId] = this.calculateMasteryLevel(
      retentionScore,
      point.studyCount
    )

    // Update meridian progress
    if (meridian && progress.meridianProgress[meridian]) {
      const meridianPoints = getAllPoints().filter(p => p.meridian === meridian)
      const meridianMastery = meridianPoints.reduce((sum, p) => 
        sum + (progress.masteryLevels[p.id] || 0), 0) / meridianPoints.length
      progress.meridianProgress[meridian].masteryLevel = meridianMastery
    }

    this.saveProgress(progress)
  }

  static calculateMasteryLevel(retentionScore, studyCount) {
    // Simple mastery calculation for now
    // Can be refined based on spaced repetition principles later
    if (retentionScore >= 0.9 && studyCount >= 5) return 5 // Mastered
    if (retentionScore >= 0.7 && studyCount >= 3) return 4 // Proficient
    if (retentionScore >= 0.5 && studyCount >= 2) return 3 // Competent
    if (retentionScore > 0) return 2 // Practiced
    if (studyCount > 0) return 1 // Started
    return 0 // New
  }

  static getPointsNeedingReview() {
    const progress = this.getProgress()
    const allPoints = getAllPoints()
    const now = new Date()

    // Filter points based on review criteria
    return allPoints.filter(point => {
      const stats = progress.studiedPoints[point.id]

      // If never studied, needs review
      if (!stats) return true

      const lastStudiedDate = stats.lastStudied ? new Date(stats.lastStudied) : null
      const daysSinceLastStudied = lastStudiedDate ? (now - lastStudiedDate) / (1000 * 60 * 60 * 24) : Infinity

      // Needs review if:
      // 1. Hasn't been studied in a while (e.g., 7 days for mastery < 5, 30 days for mastery 5)
      // 2. Has low mastery level (< 4)
      const masteryLevel = this.calculateMasteryLevel(stats.correctAnswers / (stats.quizAttempts || 1), stats.studyCount)

      if (masteryLevel < 4 && daysSinceLastStudied >= 7) return true
      if (masteryLevel >= 4 && daysSinceLastStudied >= 30) return true

      return false
    })
  }

  static getPointStats(pointId) {
    const progress = this.getProgress()
    return progress.studiedPoints[pointId] || {
      lastStudied: null,
      studyCount: 0,
      quizAttempts: 0,
      correctAnswers: 0
    }
  }

  static getStats() {
    const progress = this.getProgress()
    const allPoints = getAllPoints()
    const totalPoints = allPoints.length
    const studiedPointsCount = Object.keys(progress.studiedPoints).length
    const totalSessions = progress.totalSessions || 0

    // Calculate overall mastery level (average of all masteryLevels)
    const totalMastery = Object.values(progress.masteryLevels).reduce((sum, level) => sum + level, 0)
    const averageMastery = totalPoints > 0 ? totalMastery / totalPoints : 0

    return {
      totalPoints,
      studiedPointsCount,
      overallProgressPercentage: totalPoints > 0 ? Math.round((studiedPointsCount / totalPoints) * 100) : 0,
      totalSessions,
      averageMastery: Math.round(averageMastery * 10) / 10, // Round to 1 decimal place
      totalQuizAttempts: progress.totalQuizAttempts || 0
    }
  }

  static completeSession(sessionType, cardsViewed = 0) {
    const progress = this.getProgress()
    progress.totalSessions = (progress.totalSessions || 0) + 1
    progress.lastSessionDate = new Date().toISOString()
    
    // Ensure sessionHistory exists (backward compatibility)
    if (!progress.sessionHistory) {
      progress.sessionHistory = []
    }
    
    // Record session details in sessionHistory
    progress.sessionHistory.push({
      type: sessionType,
      timestamp: new Date().toISOString(),
      cardsViewed: cardsViewed
      // Add more session details here if needed
    })
    this.saveProgress(progress)
  }

  static resetProgress() {
    localStorage.removeItem(this.STORAGE_KEY);
    // Re-initialize after removal
    this.initializeProgress();
  }

  // --- New/Corrected Quiz Functions ---

  static getQuizStats(pointId) {
    const progress = this.getProgress();
    const pointStats = progress.studiedPoints[pointId] || {};
    return {
      quizAttempts: pointStats.quizAttempts || 0,
      correctAnswers: pointStats.correctAnswers || 0
    };
  }

  static recordQuizAttempt(pointId, isCorrect) {
    const progress = this.getProgress();
    const now = new Date().toISOString();

    // Initialize point progress if needed
    if (!progress.studiedPoints[pointId]) {
      progress.studiedPoints[pointId] = {
        lastStudied: null,
        studyCount: 0,
        quizAttempts: 0,
        correctAnswers: 0
      };
    }

    // Update point progress
    progress.studiedPoints[pointId].quizAttempts++;
    if (isCorrect) {
      progress.studiedPoints[pointId].correctAnswers++;
    }
    progress.studiedPoints[pointId].lastQuizAttempt = now; // Track last quiz attempt

    // Recalculate retention and mastery for this point
    const point = progress.studiedPoints[pointId];
    const retentionScore = point.quizAttempts > 0 
      ? point.correctAnswers / point.quizAttempts 
      : 0;
    
    progress.retentionScores[pointId] = retentionScore;
    progress.masteryLevels[pointId] = this.calculateMasteryLevel(retentionScore, point.studyCount); // Use studyCount here

    // Increment total quiz attempts
    progress.totalQuizAttempts = (progress.totalQuizAttempts || 0) + 1;

    this.saveProgress(progress);
  }
}

export default ProgressTracker

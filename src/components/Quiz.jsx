import React, { useState, useEffect } from 'react'
import flashcardsData from '../data/flashcards.json'
import { ProgressTracker } from '../utils/progressTracker'
import pronunciationManager from '../utils/pronunciation'

const Quiz = ({ navigateTo, sessionMode, quizOptions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionResults, setSessionResults] = useState([])
  const [quizQuestions, setQuizQuestions] = useState([])

  // Generate quiz questions from flashcards
  useEffect(() => {
    generateQuizQuestions()
  }, [sessionMode, quizOptions])
  const generateQuizQuestions = () => {
    let sourceCards = flashcardsData.flashcards
    
    // Check user progress to determine difficulty level
    const userProgress = ProgressTracker.getProgress()
    const totalQuizAttempts = userProgress.totalQuizAttempts || 0
    const isBeginnerUser = totalQuizAttempts < 20 // First 20 quiz attempts
    
    // Filter based on session mode or focus on points needing review
    const pointsNeedingReview = ProgressTracker.getPointsNeedingReview()
    if (pointsNeedingReview.length > 0 && Math.random() > 0.3 && !isBeginnerUser) {
      // 70% chance to quiz on points needing review (only for experienced users)
      sourceCards = flashcardsData.flashcards.filter(card => 
        pointsNeedingReview.includes(card.id)
      )
    }

    // Shuffle and take 10 cards for quiz
    const shuffled = [...sourceCards].sort(() => Math.random() - 0.5)
    const selectedCards = shuffled.slice(0, Math.min(10, shuffled.length))
    
    // Generate different types of questions based on quiz type selection
    const questions = selectedCards.map(card => {
      let questionTypes
      
      // Check if specific quiz type is selected
      if (quizOptions && quizOptions.quizType) {
        questionTypes = getQuestionTypesForQuizType(quizOptions.quizType, isBeginnerUser)
      } else {
        // Default mixed quiz types based on user level
        if (isBeginnerUser) {
          // Easier questions for beginners - focus on basic learning
          questionTypes = [
            'broken-sequence',
            'korean-name-english-choices',
            'simple-korean-to-english',
            'english-to-korean-spelling',
            'point-number-match',
            'meridian-basic',
            'healing-properties-basic',
            'martial-effects-intro'
          ]
        } else {
          // Standard questions for experienced users
          questionTypes = [
            'korean-to-english',
            'english-to-korean', 
            'english-to-korean-spelling',
            'location',
            'function',
            'meridian',
            'healing-properties-advanced',
            'martial-effects-detailed',
            'translation-mastery',
            'broken-sequence', // Keep some easy ones mixed in
            'korean-name-english-choices'
          ]
        }
      }
      
      const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)]
      return generateQuestion(card, questionType)
    })
    
    setQuizQuestions(questions)
  }

  const getQuestionTypesForQuizType = (quizType, isBeginnerUser) => {
    switch (quizType) {
      case 'translations':
        return isBeginnerUser 
          ? ['broken-sequence', 'korean-name-english-choices', 'simple-korean-to-english', 'english-to-korean-spelling']
          : ['korean-to-english', 'english-to-korean', 'translation-mastery', 'english-to-korean-spelling']
      
      case 'healing-properties':
        return isBeginnerUser
          ? ['healing-properties-basic', 'function']
          : ['healing-properties-advanced', 'function', 'healing-properties-basic']
      
      case 'martial-effects':
        return isBeginnerUser
          ? ['martial-effects-intro']
          : ['martial-effects-detailed', 'martial-effects-intro']
      
      case 'meridian-matching':
        return ['meridian-matching', 'meridian-basic', 'meridian']
      
      case 'anatomy-locations':
        return ['location', 'point-number-match']
      
      case 'mixed-challenge':
        return [
          'korean-to-english', 'english-to-korean', 'location', 'function', 
          'meridian', 'healing-properties-advanced', 'martial-effects-detailed',
          'translation-mastery', 'meridian-matching'
        ]
      
      default:
        return ['korean-name-english-choices', 'simple-korean-to-english']
    }
  }

  const generateQuestion = (card, type) => {
    const allCards = flashcardsData.flashcards
    const incorrectOptions = allCards
      .filter(c => c.id !== card.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)

    switch (type) {      case 'broken-sequence':
        // Show scrambled Korean name, user picks correct order
        const koreanChars = card.nameHangul.split('')
        const scrambled = [...koreanChars].sort(() => Math.random() - 0.5)
        return {
          question: `Unscramble the Korean name for "${card.nameEnglish}" (${card.nameRomanized}):`,
          subtext: `Scrambled: ${scrambled.join(' ')} | Point: ${card.number}`,
          correctAnswer: card.nameHangul,
          options: [
            card.nameHangul,
            ...incorrectOptions.map(c => c.nameHangul)
          ].sort(() => Math.random() - 0.5),
          card,
          type,
          isEasy: true
        }
      
      case 'korean-name-english-choices':
        // Show Korean name, pick English equivalent from choices
        return {
          question: `What does "${card.nameHangul}" (${card.nameRomanized}) mean in English?`,
          subtext: `Point ${card.number} on ${card.meridian} meridian`,
          correctAnswer: card.nameEnglish,
          options: [
            card.nameEnglish,
            ...incorrectOptions.map(c => c.nameEnglish)
          ].sort(() => Math.random() - 0.5),
          card,
          type,
          isEasy: true
        }
      
      case 'simple-korean-to-english':
        // Basic Korean to English with romanization hint
        return {
          question: `What is the English name for "${card.nameHangul}" (${card.nameRomanized})?`,
          subtext: `Point ${card.number} | Location: ${card.location}`,
          correctAnswer: card.nameEnglish,
          options: [
            card.nameEnglish,
            ...incorrectOptions.map(c => c.nameEnglish)
          ].sort(() => Math.random() - 0.5),
          card,
          type,
          isEasy: true
        }
      
      case 'point-number-match':
        // Match point number to Korean name
        return {
          question: `Which Korean name corresponds to point "${card.number}"?`,
          subtext: `English: ${card.nameEnglish} | Romanized: ${card.nameRomanized}`,
          correctAnswer: card.nameHangul,
          options: [
            card.nameHangul,
            ...incorrectOptions.map(c => c.nameHangul)
          ].sort(() => Math.random() - 0.5),
          card,
          type,          isEasy: true
        }
      
      case 'meridian-basic':
        // Basic meridian identification with visual hint
        return {
          question: `"${card.nameHangul}" (${card.nameRomanized}) belongs to which meridian?`,
          subtext: `Point ${card.number} | English: ${card.nameEnglish}`,
          correctAnswer: card.meridian,
          options: [
            card.meridian,
            ...incorrectOptions.map(c => c.meridian)
          ].sort(() => Math.random() - 0.5),
          card,
          type,
          isEasy: true
        }

      case 'english-to-korean-spelling':
        // Learn Korean spelling from English name
        return {
          question: `How do you spell "${card.nameEnglish}" (${card.nameRomanized}) in Korean?`,
          subtext: `Point ${card.number} on the ${card.meridian} meridian`,
          correctAnswer: card.nameHangul,
          options: [
            card.nameHangul,
            ...incorrectOptions.map(c => c.nameHangul)
          ].sort(() => Math.random() - 0.5),
          card,
          type,
          isEasy: true
        }

      case 'healing-properties-basic':
        // Learn basic healing properties
        return {
          question: `What is the primary healing function of "${card.nameEnglish}" (${card.nameRomanized})?`,
          subtext: `Point ${card.number} | Korean: ${card.nameHangul}`,
          correctAnswer: card.healingFunction,
          options: [
            card.healingFunction,
            ...incorrectOptions.map(c => c.healingFunction)
          ].sort(() => Math.random() - 0.5),
          card,
          type,
          isEasy: true
        }

      case 'martial-effects-intro':
        // Learn basic martial applications
        return {
          question: `What is the martial application of "${card.nameRomanized}" (${card.nameEnglish})?`,
          subtext: `Korean: ${card.nameHangul} | Healing: ${card.healingFunction}`,
          correctAnswer: card.martialApplication,
          options: [
            card.martialApplication,
            ...incorrectOptions.map(c => c.martialApplication)
          ].sort(() => Math.random() - 0.5),
          card,
          type,          isEasy: true
        }

      case 'healing-properties-advanced':
        // Advanced healing properties quiz with romanized Korean help
        return {
          question: `Which point has the healing function: "${card.healingFunction}"?`,
          subtext: `Location: ${card.location} | Answer: ${card.nameRomanized} (${card.nameEnglish})`,
          correctAnswer: card.nameHangul,
          options: [
            card.nameHangul,
            ...incorrectOptions.map(c => c.nameHangul)
          ].sort(() => Math.random() - 0.5),
          card,
          type
        }

      case 'martial-effects-detailed':
        // Advanced martial applications
        return {
          question: `Which pressure point has the martial application: "${card.martialApplication}"?`,
          subtext: `Meridian: ${card.meridian} | Number: ${card.number} | Romanized: ${card.nameRomanized}`,
          correctAnswer: card.nameEnglish,
          options: [
            card.nameEnglish,
            ...incorrectOptions.map(c => c.nameEnglish)
          ].sort(() => Math.random() - 0.5),
          card,
          type
        }

      case 'translation-mastery':
        // Complete translation test (both directions)
        const isKoreanToEnglish = Math.random() > 0.5
        if (isKoreanToEnglish) {
          return {
            question: `Translate "${card.nameHangul}" to English:`,
            subtext: `Point ${card.number} | Romanized: ${card.nameRomanized}`,
            correctAnswer: card.nameEnglish,
            options: [
              card.nameEnglish,
              ...incorrectOptions.map(c => c.nameEnglish)
            ].sort(() => Math.random() - 0.5),
            card,
            type
          }
        } else {
          return {
            question: `Translate "${card.nameEnglish}" to Korean:`,
            subtext: `Point ${card.number} | Romanized: ${card.nameRomanized} | Location: ${card.location}`,
            correctAnswer: card.nameHangul,
            options: [
              card.nameHangul,
              ...incorrectOptions.map(c => c.nameHangul)
            ].sort(() => Math.random() - 0.5),
            card,
            type
          }        }

      case 'meridian-matching':
        // Meridian matching questions with multiple variants
        const meridianQuestionVariants = [
          {
            question: `Which meridian does "${card.nameHangul}" (${card.nameRomanized}) belong to?`,
            subtext: `Point ${card.number} | English: ${card.nameEnglish}`,
            correctAnswer: card.meridian,
            options: [card.meridian, ...incorrectOptions.map(c => c.meridian)].sort(() => Math.random() - 0.5)
          },
          {
            question: `Point ${card.number} "${card.nameRomanized}" is on which meridian?`,
            subtext: `Korean: ${card.nameHangul} | English: ${card.nameEnglish}`,
            correctAnswer: card.meridian,
            options: [card.meridian, ...incorrectOptions.map(c => c.meridian)].sort(() => Math.random() - 0.5)
          },
          {
            question: `The pressure point "${card.nameEnglish}" (${card.nameRomanized}) runs along which energy pathway?`,
            subtext: `Korean: ${card.nameHangul} | Located: ${card.location}`,
            correctAnswer: card.meridian,
            options: [card.meridian, ...incorrectOptions.map(c => c.meridian)].sort(() => Math.random() - 0.5)
          }
        ]
        const selectedVariant = meridianQuestionVariants[Math.floor(Math.random() * meridianQuestionVariants.length)]
        return {
          question: selectedVariant.question,
          subtext: selectedVariant.subtext,
          correctAnswer: selectedVariant.correctAnswer,
          options: selectedVariant.options,
          card,
          type        }
        
      case 'korean-to-english':
        return {
          question: `What is the English name for ${card.nameHangul}?`,
          subtext: `Point ${card.number} | Romanized: ${card.nameRomanized}`,
          correctAnswer: card.nameEnglish,
          options: [card.nameEnglish, ...incorrectOptions.map(c => c.nameEnglish)].sort(() => Math.random() - 0.5),
          card,
          type
        }
        
      case 'english-to-korean':
        return {
          question: `What is the Korean name for ${card.nameEnglish}?`,
          subtext: `Point ${card.number} | Romanized: ${card.nameRomanized} | Location: ${card.location}`,
          correctAnswer: card.nameHangul,
          options: [card.nameHangul, ...incorrectOptions.map(c => c.nameHangul)].sort(() => Math.random() - 0.5),
          card,
          type        }
        
      case 'location':
        return {
          question: `Where is ${card.nameHangul} (${card.nameRomanized} - ${card.nameEnglish}) located?`,
          subtext: `${card.meridian} meridian | Point ${card.number}`,
          correctAnswer: card.location,
          options: [card.location, ...incorrectOptions.map(c => c.location)].sort(() => Math.random() - 0.5),
          card,
          type        }
        
      case 'function':
        return {
          question: `What is the primary healing function of ${card.nameHangul} (${card.nameRomanized})?`,
          subtext: `${card.nameEnglish} | Located: ${card.location}`,
          correctAnswer: card.healingFunction,
          options: [card.healingFunction, ...incorrectOptions.map(c => c.healingFunction)].sort(() => Math.random() - 0.5),
          card,
          type        }
        
      case 'meridian':
        return {
          question: `${card.nameHangul} (${card.nameRomanized} - ${card.nameEnglish}) belongs to which meridian?`,
          subtext: `Point ${card.number} | Healing: ${card.healingFunction}`,
          correctAnswer: card.meridian,
          options: [card.meridian, ...incorrectOptions.map(c => c.meridian)].sort(() => Math.random() - 0.5),
          card,
          type
        }
      
      default:
        return generateQuestion(card, 'korean-name-english-choices')
    }
  }

  const handleAnswerSelect = (answer) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    
    const currentQuestion = quizQuestions[currentQuestionIndex]
    const correct = selectedAnswer === currentQuestion.correctAnswer
    
    setIsCorrect(correct)
    setShowResult(true)
    
    // Record the quiz attempt
    ProgressTracker.recordQuizAttempt(currentQuestion.card.id, correct, currentQuestion.card.meridian)
    
    // Add to session results
    setSessionResults(prev => [...prev, {
      question: currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: correct,
      card: currentQuestion.card
    }])
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setIsCorrect(false)
    } else {
      setSessionComplete(true)
      // Mark session as completed
      ProgressTracker.completeSession('quiz')
    }
  }
  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setIsCorrect(false)
    setSessionComplete(false)
    setSessionResults([])
    generateQuizQuestions()
  }

  const handlePronunciation = (text, isKorean = false) => {
    if (isKorean) {
      pronunciationManager.speakKorean(text)
    } else {
      pronunciationManager.speakRomanized(text)
    }
  }
  if (quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative mb-8">
            {/* Animated Logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 border-yellow-500 mx-auto animate-pulse">
              <div className="relative">
                <div className="w-10 h-10 border-2 border-yellow-400 rounded-full"></div>
                <div className="absolute inset-1 border border-yellow-400/60 rounded-full"></div>
                <div className="absolute inset-2 border border-yellow-400/30 rounded-full"></div>
              </div>
            </div>
            
            {/* Spinning indicator */}
            <div className="absolute -top-2 -right-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-yellow-400 mb-2">Preparing Your Quiz</h3>
          <p className="text-gray-400 text-sm mb-4">Selecting questions based on your progress...</p>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
            <div className="text-xs text-gray-300 space-y-1">
              <div>🎯 Analyzing difficulty level</div>
              <div>🔄 Generating question variants</div>
              <div>📚 Including romanized Korean hints</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (sessionComplete) {
    const correctAnswers = sessionResults.filter(r => r.isCorrect).length
    const totalQuestions = sessionResults.length
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)
    
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8 max-w-md">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 border-yellow-500 mr-4">
                <div className="relative">
                  <div className="w-8 h-8 border-2 border-yellow-400 rounded-full"></div>
                  <div className="absolute inset-1 border border-yellow-400/60 rounded-full"></div>
                  <div className="absolute inset-2 border border-yellow-400/30 rounded-full"></div>
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-white">MERIDIAN</h1>
                <h2 className="text-xl text-gray-300">MASTERY COACH</h2>
              </div>
            </div>
          </header>          {/* Results */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-yellow-400 mb-4">Quiz Complete!</h3>
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-yellow-600 rounded-lg p-6 mb-6">
              <div className="text-6xl font-bold text-yellow-400 mb-2">{percentage}%</div>
              <div className="text-lg text-white">
                {correctAnswers}/{totalQuestions} Correct
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {percentage >= 80 ? "🏆 Excellent mastery!" :
                 percentage >= 60 ? "✨ Good progress, keep practicing!" :
                 "📚 More study needed. Review the material and try again."}
              </div>
            </div>
            
            {/* Detailed Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{correctAnswers}</div>
                <div className="text-xs text-gray-400">Correct</div>
              </div>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-400">{totalQuestions - correctAnswers}</div>
                <div className="text-xs text-gray-400">Incorrect</div>
              </div>
            </div>

            {/* Question Types Summary */}
            {(() => {
              const typeCounts = {}
              sessionResults.forEach(result => {
                const type = result.card?.meridian || 'Unknown'
                typeCounts[type] = (typeCounts[type] || 0) + (result.isCorrect ? 1 : 0)
              })
              const topMeridian = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]
              
              return topMeridian && (
                <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4 mb-6">
                  <div className="text-sm text-blue-400 font-medium">Best Performance</div>
                  <div className="text-lg text-white">{topMeridian[0]}</div>
                  <div className="text-xs text-gray-400">{topMeridian[1]} correct answers</div>
                </div>
              )
            })()}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={restartQuiz}
              className="w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg border border-yellow-600"
            >
              QUIZ AGAIN
            </button>
              <button
              onClick={() => navigateTo('quiz-selection')}
              className="w-full bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 hover:from-yellow-800/40 hover:to-yellow-700/40 border border-yellow-600 text-yellow-400 py-3 px-6 rounded-lg"
            >
              TRY DIFFERENT QUIZ
            </button>
            
            <button
              onClick={() => navigateTo('home')}
              className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-600 text-gray-400 py-3 px-6 rounded-lg"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = quizQuestions[currentQuestionIndex]
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <header className="text-center mb-8">          <button 
            onClick={() => navigateTo('quiz-selection')}
            className="inline-block mb-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
          >
            ← Back to Quiz Selection
          </button>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 border-yellow-500 mr-4">
              <div className="relative">
                <div className="w-8 h-8 border-2 border-yellow-400 rounded-full"></div>
                <div className="absolute inset-1 border border-yellow-400/60 rounded-full"></div>
                <div className="absolute inset-2 border border-yellow-400/30 rounded-full"></div>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">MERIDIAN</h1>
              <h2 className="text-xl text-gray-300">MASTERY QUIZ</h2>
            </div>
          </div>
        </header>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
            <span>{Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
        </div>        {/* Question */}
        <div className="mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4 text-center">
            {currentQuestion.question}
          </h3>
          
          {/* Pronunciation buttons for Korean text in question */}
          {currentQuestion.card && (currentQuestion.question.includes(currentQuestion.card.nameHangul) || currentQuestion.question.includes(currentQuestion.card.nameRomanized)) && (
            <div className="flex justify-center gap-2 mb-4">
              {currentQuestion.question.includes(currentQuestion.card.nameHangul) && (
                <button 
                  onClick={() => handlePronunciation(currentQuestion.card.nameHangul, true)}
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white text-xs transition-all duration-200 shadow-lg"
                  title="Pronounce Korean name"
                >
                  🔊
                </button>
              )}
              {currentQuestion.question.includes(currentQuestion.card.nameRomanized) && (
                <button 
                  onClick={() => handlePronunciation(currentQuestion.card.nameRomanized, false)}
                  className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center text-white text-xs transition-all duration-200 shadow-lg"
                  title="Pronounce romanized name"
                >
                  🔊
                </button>
              )}
            </div>
          )}
          
          {/* Question subtext if available */}
          {currentQuestion.subtext && (
            <p className="text-gray-400 text-xs sm:text-sm text-center mb-6 italic">
              {currentQuestion.subtext}
            </p>
          )}
          
          {/* Difficulty indicator for easy questions */}
          {currentQuestion.isEasy && (
            <div className="flex justify-center mb-4">
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
                ⭐ Beginner Level
              </span>
            </div>
          )}
            {/* Answer Options */}
          <div className="space-y-2 sm:space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 text-sm sm:text-base ${
                  showResult
                    ? option === currentQuestion.correctAnswer
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : option === selectedAnswer && option !== currentQuestion.correctAnswer
                      ? 'border-red-500 bg-red-500/20 text-red-400'
                      : 'border-gray-600 bg-gray-800 text-gray-400'
                    : selectedAnswer === option
                    ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400'
                    : 'border-gray-600 bg-gray-800 text-white hover:border-yellow-600 hover:bg-yellow-600/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {/* Add pronunciation button for Korean text in options */}
                  {option.match(/[\u3131-\uD79D]/) && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePronunciation(option, true)
                      }}
                      className="w-6 h-6 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-white text-xs transition-all duration-200 ml-2"
                      title="Pronounce Korean text"
                    >
                      🔊
                    </button>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>        {/* Result Feedback */}
        {showResult && (
          <div className={`mb-6 p-4 rounded-lg border-2 ${
            isCorrect 
              ? 'border-green-500 bg-green-500/10' 
              : 'border-red-500 bg-red-500/10'
          }`}>
            <div className={`font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </div>
            {!isCorrect && (
              <div className="text-gray-300 text-sm mb-2">
                The correct answer is: <span className="text-green-400 font-semibold">{currentQuestion.correctAnswer}</span>
              </div>
            )}
            
            {/* Educational info */}
            <div className="text-xs text-gray-400 mt-3 pt-2 border-t border-gray-600">
              <div><strong>Point:</strong> {currentQuestion.card.number} - {currentQuestion.card.nameHangul} ({currentQuestion.card.nameEnglish})</div>
              <div><strong>Location:</strong> {currentQuestion.card.location}</div>
              <div><strong>Healing:</strong> {currentQuestion.card.healingFunction}</div>
              <div><strong>Martial:</strong> {currentQuestion.card.martialApplication}</div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className={`w-full font-bold py-3 px-6 rounded-lg border ${
                selectedAnswer === null
                  ? 'bg-gray-800 border-gray-600 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 border-yellow-600 text-white'
              }`}
            >
              SUBMIT ANSWER
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg border border-yellow-600"
            >
              {currentQuestionIndex < quizQuestions.length - 1 ? 'NEXT QUESTION' : 'FINISH QUIZ'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Quiz

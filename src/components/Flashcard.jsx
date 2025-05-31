import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Flashcard = () => {
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [flashcards, setFlashcards] = useState([])

  // Sample data - replace with actual JSON data later
  useEffect(() => {
    const sampleCards = [
      {
        id: 1,
        number: "LU-1",
        nameHangul: "중부",
        nameRomanized: "Jung-Bu",
        nameEnglish: "Central Treasury",
        location: "Lateral chest, below the outer third of the clavicle",
        healingFunction: "Regulates Lung qi, stops cough, transforms phlegm",
        martialApplication: "Strike point for respiratory disruption",
        insight: "First point of the Lung meridian, connects to emotional breathing patterns",
        element: "metal"
      },
      {
        id: 2,
        number: "HT-1",
        nameHangul: "극천",
        nameRomanized: "Geuk-Cheon",
        nameEnglish: "Utmost Source",
        location: "Center of the armpit",
        healingFunction: "Calms the spirit, regulates Heart qi",
        martialApplication: "Pressure point for arm control",
        insight: "Gateway to the heart's emotional center",
        element: "fire"
      }
    ]
    setFlashcards(sampleCards)
  }, [])

  const nextCard = () => {
    setIsFlipped(false)
    setCurrentCard((prev) => (prev + 1) % flashcards.length)
  }

  const prevCard = () => {
    setIsFlipped(false)
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length)
  }

  const getElementColor = (element) => {
    const colors = {
      wood: 'border-green-500 bg-green-500/10',
      fire: 'border-red-500 bg-red-500/10',
      earth: 'border-yellow-500 bg-yellow-500/10',
      metal: 'border-gray-400 bg-gray-400/10',
      water: 'border-blue-500 bg-blue-500/10',
      violet: 'border-purple-500 bg-purple-500/10'
    }
    return colors[element] || 'border-gray-500 bg-gray-500/10'
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading flashcards...</p>
        </div>
      </div>
    )
  }

  const card = flashcards[currentCard]

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
          <h1 className="text-2xl font-bold mb-2">Flashcards</h1>
          <p className="text-gray-300">
            {currentCard + 1} of {flashcards.length}
          </p>
        </header>

        {/* Flashcard */}
        <div className="max-w-sm mx-auto mb-8">
          <div 
            className={`card relative h-96 cursor-pointer transition-transform duration-300 hover:scale-105 ${getElementColor(card.element)}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {!isFlipped ? (
              // Front of card
              <div className="text-center h-full flex flex-col justify-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{card.number}</div>
                <div className="text-xl mb-2">{card.nameHangul}</div>
                <div className="text-lg text-gray-300 mb-2">{card.nameRomanized}</div>
                <div className="text-md text-gray-400">{card.nameEnglish}</div>
                <div className="mt-4 text-xs text-gray-500">Tap to flip</div>
              </div>
            ) : (
              // Back of card
              <div className="text-sm space-y-3 h-full overflow-y-auto">
                <div>
                  <h4 className="font-semibold text-yellow-400 mb-1">Location:</h4>
                  <p className="text-gray-300">{card.location}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-green-400 mb-1">Healing Function:</h4>
                  <p className="text-gray-300">{card.healingFunction}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-400 mb-1">Martial Application:</h4>
                  <p className="text-gray-300">{card.martialApplication}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-400 mb-1">Insight:</h4>
                  <p className="text-gray-300">{card.insight}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-sm mx-auto flex justify-between items-center">
          <button 
            onClick={prevCard}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium"
          >
            Previous
          </button>
          
          <button 
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-xl font-medium"
          >
            {isFlipped ? 'Show Front' : 'Show Back'}
          </button>
          
          <button 
            onClick={nextCard}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Flashcard
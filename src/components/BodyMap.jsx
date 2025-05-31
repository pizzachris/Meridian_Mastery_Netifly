import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const BodyMap = () => {
  const [selectedPoint, setSelectedPoint] = useState(null)

  // Sample meridian points with 5 Elements color coding
  const meridianPoints = [
    { id: 1, name: "LU-1", x: 30, y: 25, element: "metal", meridian: "Lung" },
    { id: 2, name: "HT-1", x: 25, y: 35, element: "fire", meridian: "Heart" },
    { id: 3, name: "ST-1", x: 45, y: 15, element: "earth", meridian: "Stomach" },
    { id: 4, name: "LV-1", x: 48, y: 90, element: "wood", meridian: "Liver" },
    { id: 5, name: "KI-1", x: 50, y: 95, element: "water", meridian: "Kidney" },
    { id: 6, name: "GV-20", x: 50, y: 5, element: "violet", meridian: "Governing Vessel" }
  ]

  const getElementColor = (element) => {
    const colors = {
      wood: 'bg-green-500',
      fire: 'bg-red-500',
      earth: 'bg-yellow-500',
      metal: 'bg-gray-300',
      water: 'bg-blue-500',
      violet: 'bg-purple-500'
    }
    return colors[element] || 'bg-gray-500'
  }

  const handlePointClick = (point) => {
    setSelectedPoint(point)
  }

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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Body Map</h1>
          <p className="text-gray-300">Tap points to explore meridians</p>
        </header>

        {/* Body Map Container */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative bg-gray-800 rounded-2xl p-4 border border-gray-600">
            {/* Human Body Silhouette Placeholder */}
            <div className="relative w-full h-96 bg-gradient-to-b from-gray-700 to-gray-600 rounded-xl mx-auto">
              {/* Body outline - simplified representation */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Head */}
                <ellipse cx="50" cy="12" rx="8" ry="10" fill="#4B5563" stroke="#6B7280" strokeWidth="0.5"/>
                {/* Body */}
                <rect x="42" y="22" width="16" height="40" rx="3" fill="#4B5563" stroke="#6B7280" strokeWidth="0.5"/>
                {/* Arms */}
                <rect x="32" y="25" width="8" height="25" rx="3" fill="#4B5563" stroke="#6B7280" strokeWidth="0.5"/>
                <rect x="60" y="25" width="8" height="25" rx="3" fill="#4B5563" stroke="#6B7280" strokeWidth="0.5"/>
                {/* Legs */}
                <rect x="44" y="62" width="5" height="35" rx="2" fill="#4B5563" stroke="#6B7280" strokeWidth="0.5"/>
                <rect x="51" y="62" width="5" height="35" rx="2" fill="#4B5563" stroke="#6B7280" strokeWidth="0.5"/>
              </svg>

              {/* Pressure Points */}
              {meridianPoints.map((point) => (
                <button
                  key={point.id}
                  className={`absolute w-3 h-3 rounded-full ${getElementColor(point.element)} border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform duration-200`}
                  style={{ left: `${point.x}%`, top: `${point.y}%` }}
                  onClick={() => handlePointClick(point)}
                >
                  <span className="sr-only">{point.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="max-w-md mx-auto mb-8">
          <h3 className="text-lg font-semibold mb-4 text-center">5 Elements</h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Wood (Liver, GB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Fire (Heart, SI)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>Earth (Stomach, SP)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
              <span>Metal (Lung, LI)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Water (Kidney, UB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Violet (CV/GV)</span>
            </div>
          </div>
        </div>

        {/* Selected Point Info */}
        {selectedPoint && (
          <div className="max-w-md mx-auto">
            <div className="card text-center">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">{selectedPoint.name}</h3>
              <p className="text-gray-300 mb-4">{selectedPoint.meridian} Meridian</p>
              <div className="flex justify-center space-x-4">
                <Link to="/flashcards">
                  <button className="btn-primary">
                    View Flashcard
                  </button>
                </Link>
                <button 
                  onClick={() => setSelectedPoint(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BodyMap
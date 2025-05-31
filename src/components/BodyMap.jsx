import React, { useState } from 'react'
import flashcardsData from '../data/flashcards.json'
import { ProgressTracker } from '../utils/progressTracker'

const BodyMap = ({ navigateTo }) => {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [selectedMeridian, setSelectedMeridian] = useState(null)

  // Define body regions with their associated points
  const bodyRegions = {
    'HEAD & NECK': ['head', 'neck', 'face', 'temple', 'forehead', 'chin', 'throat'],
    'ARMS': ['arm', 'elbow', 'wrist', 'hand', 'finger', 'shoulder'],
    'TRUNK': ['chest', 'back', 'spine', 'intercostal', 'clavicle'],
    'LEGS': ['leg', 'knee', 'thigh', 'calf'],
    'FEET': ['foot', 'toe', 'ankle', 'heel']
  }

  // Get meridian colors
  const getMeridianColor = (meridian) => {
    const colors = {
      'Lung': '#e5e7eb',
      'Large Intestine': '#e5e7eb',
      'Stomach': '#fbbf24',
      'Spleen': '#fbbf24',
      'Heart': '#ef4444',
      'Small Intestine': '#ef4444',
      'Urinary Bladder': '#3b82f6',
      'Kidney': '#3b82f6',
      'Pericardium': '#ef4444',
      'Triple Burner': '#ef4444',
      'Gall Bladder': '#10b981',
      'Liver': '#10b981',
      'Governing Vessel': '#8b5cf6',
      'Conception Vessel': '#8b5cf6'
    }
    return colors[meridian] || '#6b7280'
  }

  // Filter points by region
  const getPointsForRegion = (regionName) => {
    const regionKeywords = bodyRegions[regionName] || []
    return flashcardsData.flashcards.filter(card => {
      const location = card.location.toLowerCase()
      return regionKeywords.some(keyword => location.includes(keyword))
    })
  }

  // Get unique meridians for current region
  const getMeridiansForRegion = (regionName) => {
    const points = getPointsForRegion(regionName)
    const meridians = [...new Set(points.map(point => point.meridian))]
    return meridians
  }

  // Get points for selected meridian in current region
  const getPointsForMeridian = (regionName, meridian) => {
    const regionPoints = getPointsForRegion(regionName)
    return regionPoints.filter(point => point.meridian === meridian)
  }

  const handleRegionSelect = (region) => {
    setSelectedRegion(region)
    setSelectedMeridian(null)
    setSelectedPoint(null)
  }

  const handleMeridianSelect = (meridian) => {
    setSelectedMeridian(selectedMeridian === meridian ? null : meridian)
    setSelectedPoint(null)
  }

  const handlePointSelect = (point) => {
    setSelectedPoint(selectedPoint?.id === point.id ? null : point)
  }
  const handleViewPoint = () => {
    if (selectedPoint) {
      // Track progress when viewing a point
      ProgressTracker.viewPoint(selectedPoint.id, selectedPoint.meridian)
      navigateTo('flashcards', { selectedPointId: selectedPoint.id })
    }
  }

  // Generate point positions for the anatomical diagram
  const getPointPosition = (pointNumber, total, regionName) => {
    const positions = {
      'HEAD & NECK': [
        { x: 50, y: 20 }, { x: 45, y: 25 }, { x: 55, y: 25 }, { x: 50, y: 30 },
        { x: 40, y: 35 }, { x: 60, y: 35 }, { x: 50, y: 40 }, { x: 45, y: 45 }
      ],
      'ARMS': [
        { x: 30, y: 20 }, { x: 70, y: 20 }, { x: 25, y: 35 }, { x: 75, y: 35 },
        { x: 20, y: 50 }, { x: 80, y: 50 }, { x: 15, y: 65 }, { x: 85, y: 65 }
      ],
      'TRUNK': [
        { x: 50, y: 25 }, { x: 45, y: 35 }, { x: 55, y: 35 }, { x: 50, y: 45 },
        { x: 40, y: 55 }, { x: 60, y: 55 }, { x: 50, y: 65 }, { x: 45, y: 75 }
      ],
      'LEGS': [
        { x: 45, y: 20 }, { x: 55, y: 20 }, { x: 40, y: 40 }, { x: 60, y: 40 },
        { x: 45, y: 60 }, { x: 55, y: 60 }, { x: 40, y: 80 }, { x: 60, y: 80 }
      ],
      'FEET': [
        { x: 40, y: 30 }, { x: 60, y: 30 }, { x: 45, y: 50 }, { x: 55, y: 50 },
        { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 45, y: 85 }, { x: 55, y: 85 }
      ]
    }
    const regionPositions = positions[regionName] || []
    return regionPositions[pointNumber % regionPositions.length] || { x: 50, y: 50 }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header with Logo */}
        <header className="text-center mb-8">
          <button 
            onClick={() => navigateTo('home')}
            className="inline-block mb-4 text-yellow-400 hover:text-yellow-300 text-sm font-medium"
          >
            ← Back to Home
          </button>
          
          {/* Logo and Title */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-800 to-red-900 rounded-full flex items-center justify-center border-2 border-yellow-500 mr-4">
              {/* Triple spiral logo */}
              <div className="relative">
                <div className="w-8 h-8 border-2 border-yellow-400 rounded-full"></div>
                <div className="absolute inset-1 border border-yellow-400/60 rounded-full"></div>
                <div className="absolute inset-2 border border-yellow-400/30 rounded-full"></div>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-white">EXPLORE</h1>
              <h2 className="text-xl text-gray-300">BODY MAP</h2>
            </div>
          </div>
        </header>

        {!selectedRegion ? (
          // Region Selection View
          <div className="space-y-4">
            {/* Anatomical figure */}
            <div className="relative bg-gray-900 rounded-lg p-6 mb-6 border border-yellow-600">
              <svg viewBox="0 0 100 100" className="w-full h-64 mx-auto">
                {/* Simple anatomical figure */}
                <ellipse cx="50" cy="12" rx="8" ry="10" fill="#8B4513" stroke="#D4AF37" strokeWidth="0.5"/>
                <rect x="42" y="22" width="16" height="35" rx="3" fill="#8B4513" stroke="#D4AF37" strokeWidth="0.5"/>
                <rect x="32" y="25" width="8" height="25" rx="3" fill="#8B4513" stroke="#D4AF37" strokeWidth="0.5"/>
                <rect x="60" y="25" width="8" height="25" rx="3" fill="#8B4513" stroke="#D4AF37" strokeWidth="0.5"/>
                <rect x="44" y="57" width="5" height="30" rx="2" fill="#8B4513" stroke="#D4AF37" strokeWidth="0.5"/>
                <rect x="51" y="57" width="5" height="30" rx="2" fill="#8B4513" stroke="#D4AF37" strokeWidth="0.5"/>
                <ellipse cx="47" cy="90" rx="3" ry="2" fill="#8B4513" stroke="#D4AF37" strokeWidth="0.5"/>
                <ellipse cx="53" cy="90" rx="3" ry="2" fill="#8B4513" stroke="#D4AF37" strokeWidth="0.5"/>
              </svg>
            </div>

            {/* Region Buttons */}
            <div className="space-y-3">
              {Object.keys(bodyRegions).map((region) => {
                const pointCount = getPointsForRegion(region).length
                return (
                  <button
                    key={region}
                    onClick={() => handleRegionSelect(region)}
                    className="w-full bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-600 text-yellow-400 py-3 px-4 rounded-lg hover:from-yellow-800/40 hover:to-yellow-700/40 transition-all duration-200"
                  >
                    {region}
                  </button>
                )
              })}
            </div>

            <div className="text-center text-gray-400 text-sm mt-6">
              Tap on a body region<br />
              to view available points.
            </div>
          </div>
        ) : (
          // Individual Region View
          <div className="space-y-6">
            {/* Region Header */}
            <div className="text-center">
              <button
                onClick={() => setSelectedRegion(null)}
                className="text-yellow-400 hover:text-yellow-300 mb-4"
              >
                ← Back to Regions
              </button>
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">{selectedRegion}</h2>
            </div>

            {/* Anatomical Diagram for Region */}
            <div className="relative bg-gray-900 rounded-lg p-6 border border-yellow-600">
              <svg viewBox="0 0 100 100" className="w-full h-64 mx-auto">
                {/* Region-specific anatomy */}
                {selectedRegion === 'HEAD & NECK' && (
                  <>
                    <ellipse cx="50" cy="35" rx="20" ry="25" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                    <rect x="45" y="60" width="10" height="15" rx="2" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                  </>
                )}
                {selectedRegion === 'ARMS' && (
                  <>
                    <rect x="20" y="20" width="15" height="40" rx="5" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                    <rect x="65" y="20" width="15" height="40" rx="5" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="27" cy="65" rx="8" ry="5" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="73" cy="65" rx="8" ry="5" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                  </>
                )}
                {selectedRegion === 'TRUNK' && (
                  <rect x="35" y="20" width="30" height="50" rx="5" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                )}
                {selectedRegion === 'LEGS' && (
                  <>
                    <rect x="40" y="20" width="8" height="40" rx="3" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                    <rect x="52" y="20" width="8" height="40" rx="3" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                  </>
                )}
                {selectedRegion === 'FEET' && (
                  <>
                    <ellipse cx="40" cy="40" rx="12" ry="8" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="60" cy="40" rx="12" ry="8" fill="#8B4513" stroke="#D4AF37" strokeWidth="1"/>
                  </>
                )}

                {/* Display points for selected meridian */}
                {selectedMeridian && getPointsForMeridian(selectedRegion, selectedMeridian).map((point, index) => {
                  const position = getPointPosition(index, getPointsForMeridian(selectedRegion, selectedMeridian).length, selectedRegion)
                  const isSelected = selectedPoint?.id === point.id
                  return (
                    <circle
                      key={point.id}
                      cx={position.x}
                      cy={position.y}
                      r={isSelected ? "3" : "2"}
                      fill={getMeridianColor(point.meridian)}
                      stroke={isSelected ? "#FBBF24" : "#FFFFFF"}
                      strokeWidth={isSelected ? "2" : "1"}
                      className="cursor-pointer hover:r-3 transition-all duration-200"
                      onClick={() => handlePointSelect(point)}
                    />
                  )
                })}
              </svg>

              {/* Point labels */}
              {selectedMeridian && (
                <div className="mt-4 text-center">
                  {getPointsForMeridian(selectedRegion, selectedMeridian).map((point, index) => {
                    const isSelected = selectedPoint?.id === point.id
                    return (
                      <span
                        key={point.id}
                        className={`inline-block px-2 py-1 m-1 text-xs rounded ${
                          isSelected 
                            ? 'bg-yellow-600 text-black' 
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        {point.number}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Meridian Selection */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-300">Select Meridian:</h3>
              {getMeridiansForRegion(selectedRegion).map((meridian) => {
                const pointCount = getPointsForMeridian(selectedRegion, meridian).length
                const isSelected = selectedMeridian === meridian
                return (
                  <button
                    key={meridian}
                    onClick={() => handleMeridianSelect(meridian)}
                    className={`w-full py-2 px-4 rounded-lg border transition-all duration-200 flex justify-between items-center ${
                      isSelected
                        ? 'border-yellow-400 bg-yellow-900/30 text-yellow-400'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span>{meridian}</span>
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: getMeridianColor(meridian) }}
                    ></span>
                  </button>
                )
              })}
            </div>

            {/* Selected Point Info */}
            {selectedPoint && (
              <div className="bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-600 rounded-lg p-4">
                <h4 className="font-bold text-yellow-400 text-lg mb-2">
                  {selectedPoint.number} - {selectedPoint.nameEnglish}
                </h4>
                <p className="text-gray-300 text-sm mb-4">{selectedPoint.nameRomanized}</p>
                <button
                  onClick={handleViewPoint}
                  className="w-full bg-gradient-to-r from-red-800 to-red-900 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-lg border border-yellow-600"
                >
                  VIEW POINT
                </button>
              </div>
            )}

            <div className="text-center text-gray-400 text-sm">
              Master your meridians.<br />
              Restore your power.
            </div>
          </div>        )}
      </div>
    </div>
  )
}

export default BodyMap
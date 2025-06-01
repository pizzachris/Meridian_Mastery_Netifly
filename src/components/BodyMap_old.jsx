import React, { useState } from 'react'
import flashcardsData from '../data/flashcards.json'
import { ProgressTracker } from '../utils/progressTracker'

const BodyMap = ({ navigateTo }) => {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [selectedMeridian, setSelectedMeridian] = useState(null)
  const [viewSide, setViewSide] = useState('front') // 'front' or 'back'
  // Define body regions with their associated points
  const bodyRegions = {
    'HEAD & NECK': ['head', 'neck', 'face', 'temple', 'forehead', 'chin', 'throat', 'occiput', 'nape'],
    'ARMS': ['arm', 'elbow', 'wrist', 'hand', 'finger', 'shoulder'],
    'TRUNK': ['chest', 'back', 'spine', 'intercostal', 'clavicle', 'scapula', 'thoracic', 'lumbar'],
    'LEGS': ['leg', 'knee', 'thigh', 'calf', 'posterior thigh', 'posterior leg'],
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
  // Filter points by region with improved anatomical awareness
  const getPointsForRegion = (regionName) => {
    const regionKeywords = bodyRegions[regionName] || []
    return flashcardsData.flashcards.filter(card => {
      const location = card.location.toLowerCase()
      const meridian = card.meridian
      
      // Enhanced back point detection
      const isBackPoint = location.includes('back') || location.includes('spine') || 
                         location.includes('posterior') || location.includes('scapula') ||
                         location.includes('vertebra') || location.includes('occiput') ||
                         meridian === 'Bladder' || meridian === 'Governing Vessel'
      
      // Show points based on current view (front/back) and region with meridian-specific rules
      const matchesRegion = regionKeywords.some(keyword => location.includes(keyword))
      
      if (viewSide === 'back') {
        // Include back-specific meridians and back points
        return matchesRegion && (
          isBackPoint || 
          meridian === 'Bladder' || 
          meridian === 'Governing Vessel' || 
          (meridian === 'Small Intestine' && location.includes('scapula')) ||
          (meridian === 'Gall Bladder' && location.includes('occiput'))
        )
      } else {
        // Front view includes all non-back points and specific front meridians
        return matchesRegion && (
          !isBackPoint || 
          meridian === 'Conception Vessel' ||
          (meridian === 'Stomach' && location.includes('face')) ||
          (meridian === 'Large Intestine' && location.includes('face'))
        )
      }
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
  }  // Generate point positions for the anatomical diagram
  const getPointPosition = (pointNumber, total, regionName) => {
    const frontPositions = {
      'HEAD & NECK': [
        // Head positions aligned with the SVG head (cx=50, cy=12, neck at y=20-25)
        { x: 50, y: 8 }, // top of head
        { x: 47, y: 10 }, { x: 53, y: 10 }, // temples
        { x: 47, y: 12 }, { x: 53, y: 12 }, // eyes area (removed weird box)
        { x: 50, y: 14 }, // nose area
        { x: 47, y: 16 }, { x: 53, y: 16 }, // cheeks
        { x: 50, y: 18 }, // mouth area
        { x: 47, y: 20 }, { x: 53, y: 20 }, // jaw
        { x: 50, y: 22 }, // throat/neck start
        { x: 47, y: 24 }, { x: 53, y: 24 }, // neck sides
      ],
      'ARMS': [
        // Arms aligned with SVG body (shoulders at x=35,65 y=32, hands ending around y=66)
        { x: 35, y: 28 }, { x: 65, y: 28 }, // shoulders
        { x: 35, y: 35 }, { x: 65, y: 35 }, // upper arms
        { x: 32, y: 44 }, { x: 68, y: 44 }, // elbows
        { x: 30, y: 52 }, { x: 70, y: 52 }, // forearms
        { x: 28, y: 60 }, { x: 72, y: 60 }, // wrists
        { x: 27, y: 64 }, { x: 73, y: 64 }, // hands
      ],
      'TRUNK': [
        // Trunk aligned with torso path (x=42-58, y=25-55)
        { x: 46, y: 27 }, { x: 54, y: 27 }, // upper chest
        { x: 44, y: 32 }, { x: 56, y: 32 }, // mid chest
        { x: 50, y: 30 }, // center chest
        { x: 46, y: 38 }, { x: 54, y: 38 }, // lower chest
        { x: 50, y: 42 }, // solar plexus
        { x: 46, y: 46 }, { x: 54, y: 46 }, // abdomen
        { x: 50, y: 50 }, // navel area
        { x: 46, y: 54 }, { x: 54, y: 54 }, // lower abdomen
      ],
      'LEGS': [
        // Legs aligned with SVG legs (x=45,55 for thighs, x=43,57 for calves)
        { x: 46, y: 62 }, { x: 54, y: 62 }, // hips
        { x: 45, y: 70 }, { x: 55, y: 70 }, // upper thigh
        { x: 45, y: 78 }, { x: 55, y: 78 }, // mid thigh
        { x: 45, y: 85 }, { x: 55, y: 85 }, // knees
        { x: 43, y: 92 }, { x: 57, y: 92 }, // calves
        { x: 43, y: 100 }, { x: 57, y: 100 }, // ankles
      ],
      'FEET': [
        // Feet aligned with SVG feet (x=41,59 y=110)
        { x: 41, y: 108 }, { x: 59, y: 108 }, // ankles
        { x: 39, y: 110 }, { x: 61, y: 110 }, // heel/arch        { x: 37, y: 112 }, { x: 63, y: 112 }, // mid foot
        { x: 35, y: 114 }, { x: 65, y: 114 }, // toes area
        { x: 33, y: 115 }, { x: 67, y: 115 }, // toe tips
      ]
    }

    const backPositions = {
      'HEAD & NECK': [
        // Back of head and neck aligned with back SVG
        { x: 50, y: 8 }, // crown/vertex
        { x: 47, y: 10 }, { x: 53, y: 10 }, // back of head
        { x: 50, y: 12 }, // occiput (center of head)
        { x: 47, y: 15 }, { x: 53, y: 15 }, // base of skull
        { x: 50, y: 20 }, // nape of neck
        { x: 47, y: 22 }, { x: 53, y: 22 }, // neck vertebrae
        { x: 50, y: 24 }, // lower neck
      ],
      'ARMS': [
        // Back of arms aligned with back SVG arms
        { x: 35, y: 28 }, { x: 65, y: 28 }, // shoulder blades
        { x: 35, y: 35 }, { x: 65, y: 35 }, // back upper arms
        { x: 32, y: 44 }, { x: 68, y: 44 }, // back elbows
        { x: 30, y: 52 }, { x: 70, y: 52 }, // back forearms
        { x: 28, y: 60 }, { x: 72, y: 60 }, // back wrists
        { x: 27, y: 64 }, { x: 73, y: 64 }, // back hands
      ],
      'TRUNK': [
        // Spine and back trunk - aligned with spine line and scapula
        { x: 50, y: 25 }, // upper spine (vertebrae)
        { x: 47, y: 30 }, { x: 50, y: 30 }, { x: 53, y: 30 }, // thoracic spine
        { x: 47, y: 35 }, { x: 50, y: 35 }, { x: 53, y: 35 }, // mid thoracic
        { x: 47, y: 40 }, { x: 50, y: 40 }, { x: 53, y: 40 }, // lower thoracic
        { x: 47, y: 45 }, { x: 50, y: 45 }, { x: 53, y: 45 }, // lumbar spine
        { x: 47, y: 50 }, { x: 50, y: 50 }, { x: 53, y: 50 }, // lower lumbar
        { x: 42, y: 32 }, { x: 58, y: 32 }, // scapula areas
        { x: 40, y: 36 }, { x: 60, y: 36 }, // lateral back
      ],
      'LEGS': [
        // Back of legs aligned with back leg SVG
        { x: 46, y: 58 }, { x: 54, y: 58 }, // buttocks/hip area
        { x: 45, y: 70 }, { x: 55, y: 70 }, // posterior thigh
        { x: 45, y: 78 }, { x: 55, y: 78 }, // back of knee
        { x: 45, y: 85 }, { x: 55, y: 85 }, // popliteal area
        { x: 43, y: 92 }, { x: 57, y: 92 }, // posterior calf
        { x: 43, y: 100 }, { x: 57, y: 100 }, // achilles area
      ],
      'FEET': [
        // Back/heel area of feet aligned with heel SVG
        { x: 41, y: 108 }, { x: 59, y: 108 }, // ankles (back)
        { x: 41, y: 110 }, { x: 59, y: 110 }, // heel center
        { x: 39, y: 112 }, { x: 61, y: 112 }, // heel sides
        { x: 41, y: 114 }, { x: 59, y: 114 }, // achilles connection
      ]
    }

    const positions = viewSide === 'back' ? backPositions : frontPositions
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
          <div className="space-y-4">            {/* Anatomical figure */}
            <div className="relative bg-gray-900 rounded-lg p-6 mb-6 border border-yellow-600">
              {/* Front/Back Toggle */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-800 rounded-lg p-1 flex">
                  <button
                    onClick={() => setViewSide('front')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewSide === 'front' 
                        ? 'bg-yellow-600 text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    FRONT
                  </button>
                  <button
                    onClick={() => setViewSide('back')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewSide === 'back' 
                        ? 'bg-yellow-600 text-black' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    BACK
                  </button>
                </div>
              </div>
              
              <svg viewBox="0 0 100 120" className="w-full h-80 mx-auto">
                {viewSide === 'front' ? (
                  // FRONT VIEW - Anatomical Skeleton Model
                  <>
                    {/* Skull - Anatomically accurate proportions */}
                    <g id="skull">
                      {/* Cranium */}
                      <ellipse cx="50" cy="8" rx="8" ry="6" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.3"/>
                      {/* Facial structure */}
                      <path d="M 42 12 Q 50 16 58 12 Q 58 18 50 20 Q 42 18 42 12 Z" 
                            fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.3"/>
                      {/* Eye sockets */}
                      <ellipse cx="46" cy="13" rx="1.5" ry="1" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.2"/>
                      <ellipse cx="54" cy="13" rx="1.5" ry="1" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.2"/>
                      {/* Nasal cavity */}
                      <path d="M 49 15 L 51 15 L 50.5 17 L 49.5 17 Z" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.2"/>
                    </g>
                    
                    {/* Cervical spine/neck */}
                    <g id="cervical">
                      <rect x="49" y="20" width="2" height="6" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.2"/>
                      <circle cx="50" cy="22" r="0.5" fill="#E0E0E0"/>
                      <circle cx="50" cy="24" r="0.5" fill="#E0E0E0"/>
                    </g>
                    
                    {/* Clavicles (collar bones) */}
                    <g id="clavicles">
                      <path d="M 38 26 Q 44 24 50 25 Q 56 24 62 26" 
                            stroke="#D3D3D3" strokeWidth="1.5" fill="none"/>
                    </g>
                    
                    {/* Ribcage - Anatomically accurate */}
                    <g id="ribcage">
                      {/* Sternum */}
                      <rect x="49" y="26" width="2" height="20" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.3"/>
                      
                      {/* Ribs - pairs from top to bottom */}
                      <ellipse cx="50" cy="28" rx="10" ry="2" fill="none" stroke="#D3D3D3" strokeWidth="0.8"/>
                      <ellipse cx="50" cy="32" rx="11" ry="2.5" fill="none" stroke="#D3D3D3" strokeWidth="0.8"/>
                      <ellipse cx="50" cy="36" rx="12" ry="3" fill="none" stroke="#D3D3D3" strokeWidth="0.8"/>
                      <ellipse cx="50" cy="40" rx="11.5" ry="3" fill="none" stroke="#D3D3D3" strokeWidth="0.8"/>
                      <ellipse cx="50" cy="44" rx="10" ry="2.5" fill="none" stroke="#D3D3D3" strokeWidth="0.8"/>
                      
                      {/* Costal cartilage (lower ribs) */}
                      <path d="M 42 46 Q 46 47 50 47 Q 54 47 58 46" 
                            stroke="#D3D3D3" strokeWidth="0.6" fill="none"/>
                    </g>
                    
                    {/* Spine - visible portions */}
                    <g id="spine">
                      {/* Thoracic vertebrae dots */}
                      <circle cx="50" cy="30" r="0.4" fill="#E0E0E0"/>
                      <circle cx="50" cy="34" r="0.4" fill="#E0E0E0"/>
                      <circle cx="50" cy="38" r="0.4" fill="#E0E0E0"/>
                      <circle cx="50" cy="42" r="0.4" fill="#E0E0E0"/>
                    </g>
                    
                    {/* Pelvis - anatomically correct */}
                    <g id="pelvis">
                      <ellipse cx="50" cy="50" rx="12" ry="6" fill="none" stroke="#D3D3D3" strokeWidth="1.2"/>
                      {/* Hip bones */}
                      <circle cx="42" cy="48" r="2" fill="none" stroke="#D3D3D3" strokeWidth="0.8"/>
                      <circle cx="58" cy="48" r="2" fill="none" stroke="#D3D3D3" strokeWidth="0.8"/>
                      {/* Sacrum */}
                      <path d="M 48 50 L 52 50 L 51 56 L 49 56 Z" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.3"/>
                    </g>
                    
                    {/* Arms - skeletal structure */}
                    <g id="leftArm">
                      {/* Left shoulder */}
                      <circle cx="38" cy="28" r="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.5"/>
                      {/* Left humerus */}
                      <line x1="38" y1="30" x2="35" y2="45" stroke="#D3D3D3" strokeWidth="2"/>
                      {/* Left elbow */}
                      <circle cx="35" cy="45" r="1.5" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.4"/>
                      {/* Left radius & ulna */}
                      <line x1="35" y1="47" x2="33" y2="62" stroke="#D3D3D3" strokeWidth="1.5"/>
                      <line x1="35" y1="47" x2="37" y2="62" stroke="#D3D3D3" strokeWidth="1.5"/>
                      {/* Left wrist */}
                      <rect x="33" y="62" width="4" height="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.3"/>
                      {/* Left hand bones */}
                      <path d="M 33 64 L 33 68 M 34.5 64 L 34.5 69 M 36 64 L 36 68.5 M 37 64 L 37 67" 
                            stroke="#D3D3D3" strokeWidth="0.8"/>
                    </g>
                    
                    <g id="rightArm">
                      {/* Right shoulder */}
                      <circle cx="62" cy="28" r="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.5"/>
                      {/* Right humerus */}
                      <line x1="62" y1="30" x2="65" y2="45" stroke="#D3D3D3" strokeWidth="2"/>
                      {/* Right elbow */}
                      <circle cx="65" cy="45" r="1.5" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.4"/>
                      {/* Right radius & ulna */}
                      <line x1="65" y1="47" x2="67" y2="62" stroke="#D3D3D3" strokeWidth="1.5"/>
                      <line x1="65" y1="47" x2="63" y2="62" stroke="#D3D3D3" strokeWidth="1.5"/>
                      {/* Right wrist */}
                      <rect x="63" y="62" width="4" height="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.3"/>
                      {/* Right hand bones */}
                      <path d="M 67 64 L 67 68 M 65.5 64 L 65.5 69 M 64 64 L 64 68.5 M 63 64 L 63 67" 
                            stroke="#D3D3D3" strokeWidth="0.8"/>
                    </g>
                    
                    {/* Legs - skeletal structure */}
                    <g id="leftLeg">
                      {/* Left hip joint */}
                      <circle cx="45" cy="56" r="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.5"/>
                      {/* Left femur */}
                      <line x1="45" y1="58" x2="44" y2="78" stroke="#D3D3D3" strokeWidth="2.5"/>
                      {/* Left knee */}
                      <circle cx="44" cy="78" r="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.5"/>
                      <ellipse cx="44" cy="78" rx="3" ry="1.5" fill="none" stroke="#D3D3D3" strokeWidth="0.4"/>
                      {/* Left tibia & fibula */}
                      <line x1="44" y1="80" x2="43" y2="98" stroke="#D3D3D3" strokeWidth="2"/>
                      <line x1="44" y1="80" x2="45" y2="98" stroke="#D3D3D3" strokeWidth="1.5"/>
                      {/* Left ankle */}
                      <circle cx="43.5" cy="98" r="1.5" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.4"/>
                      {/* Left foot */}
                      <ellipse cx="43" cy="102" rx="4" ry="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.5"/>
                      <path d="M 41 103 L 41 105 M 42.5 103 L 42.5 105.5 M 44 103 L 44 105 M 45.5 103 L 45.5 104" 
                            stroke="#D3D3D3" strokeWidth="0.6"/>
                    </g>
                    
                    <g id="rightLeg">
                      {/* Right hip joint */}
                      <circle cx="55" cy="56" r="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.5"/>
                      {/* Right femur */}
                      <line x1="55" y1="58" x2="56" y2="78" stroke="#D3D3D3" strokeWidth="2.5"/>
                      {/* Right knee */}
                      <circle cx="56" cy="78" r="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.5"/>
                      <ellipse cx="56" cy="78" rx="3" ry="1.5" fill="none" stroke="#D3D3D3" strokeWidth="0.4"/>
                      {/* Right tibia & fibula */}
                      <line x1="56" y1="80" x2="57" y2="98" stroke="#D3D3D3" strokeWidth="2"/>
                      <line x1="56" y1="80" x2="55" y2="98" stroke="#D3D3D3" strokeWidth="1.5"/>
                      {/* Right ankle */}
                      <circle cx="56.5" cy="98" r="1.5" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.4"/>
                      {/* Right foot */}
                      <ellipse cx="57" cy="102" rx="4" ry="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.5"/>
                      <path d="M 59 103 L 59 105 M 57.5 103 L 57.5 105.5 M 56 103 L 56 105 M 54.5 103 L 54.5 104" 
                            stroke="#D3D3D3" strokeWidth="0.6"/>
                    </g>
                    {/* Sternum line */}
                    <line x1="50" y1="25" x2="50" y2="50" stroke="#B8860B" strokeWidth="0.4" opacity="0.7"/>
                    
                    {/* Clavicles (collar bones) */}
                    <path d="M 42 25 Q 46 24 50 25 Q 54 24 58 25" stroke="#B8860B" strokeWidth="0.6" fill="none"/>
                    
                    {/* Detailed Arms with muscle definition */}
                    {/* Left shoulder and arm */}
                    <circle cx="38" cy="28" r="3" fill="#D4A574" stroke="#B8860B" strokeWidth="0.4"/>
                    <path d="M 35 31 Q 32 38 30 45 Q 28 52 26 58 Q 25 62 24 66" 
                          stroke="#B8860B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M 33 31 Q 30 38 28 45 Q 26 52 24 58 Q 23 62 22 66" 
                          stroke="#D4A574" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    
                    {/* Left hand */}
                    <ellipse cx="22" cy="68" rx="2" ry="3" fill="#D4A574" stroke="#B8860B" strokeWidth="0.3"/>
                    <path d="M 20 69 L 18 70 M 21 71 L 19 72 M 22 71 L 20 72 M 23 71 L 21 72 M 24 70 L 22 71" 
                          stroke="#B8860B" strokeWidth="0.3"/>
                    
                    {/* Right shoulder and arm */}
                    <circle cx="62" cy="28" r="3" fill="#D4A574" stroke="#B8860B" strokeWidth="0.4"/>
                    <path d="M 65 31 Q 68 38 70 45 Q 72 52 74 58 Q 75 62 76 66" 
                          stroke="#B8860B" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    <path d="M 67 31 Q 70 38 72 45 Q 74 52 76 58 Q 77 62 78 66" 
                          stroke="#D4A574" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    
                    {/* Right hand */}
                    <ellipse cx="78" cy="68" rx="2" ry="3" fill="#D4A574" stroke="#B8860B" strokeWidth="0.3"/>
                    <path d="M 80 69 L 82 70 M 79 71 L 81 72 M 78 71 L 80 72 M 77 71 L 79 72 M 76 70 L 78 71" 
                          stroke="#B8860B" strokeWidth="0.3"/>
                    
                    {/* Hip/Pelvis with bone structure */}
                    <path d="M 42 58 Q 40 62 42 66 Q 44 68 50 68 Q 56 68 58 66 Q 60 62 58 58" 
                          fill="#D4A574" stroke="#B8860B" strokeWidth="0.5"/>
                    <path d="M 43 60 Q 50 58 57 60" stroke="#B8860B" strokeWidth="0.4" fill="none" opacity="0.7"/>
                    
                    {/* Detailed legs with muscle groups */}
                    {/* Left leg */}
                    <path d="M 44 68 Q 42 75 42 82 Q 42 90 40 97 Q 39 103 38 108" 
                          stroke="#B8860B" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    <path d="M 46 68 Q 44 75 44 82 Q 44 90 42 97 Q 41 103 40 108" 
                          stroke="#D4A574" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    
                    {/* Left knee joint */}
                    <circle cx="42" cy="82" r="1.5" fill="none" stroke="#B8860B" strokeWidth="0.4"/>
                    
                    {/* Right leg */}
                    <path d="M 56 68 Q 58 75 58 82 Q 58 90 60 97 Q 61 103 62 108" 
                          stroke="#B8860B" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    <path d="M 54 68 Q 56 75 56 82 Q 56 90 58 97 Q 59 103 60 108" 
                          stroke="#D4A574" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                    
                    {/* Right knee joint */}
                    <circle cx="58" cy="82" r="1.5" fill="none" stroke="#B8860B" strokeWidth="0.4"/>
                    
                    {/* Detailed feet */}
                    <path d="M 38 108 Q 35 110 34 112 Q 33 114 35 115 Q 40 116 42 115 Q 43 113 42 111" 
                          fill="#D4A574" stroke="#B8860B" strokeWidth="0.4"/>
                    <path d="M 62 108 Q 65 110 66 112 Q 67 114 65 115 Q 60 116 58 115 Q 57 113 58 111" 
                          fill="#D4A574" stroke="#B8860B" strokeWidth="0.4"/>
                    
                    {/* Toe details */}
                    <circle cx="34" cy="114" r="0.5" fill="#D4A574" stroke="#B8860B" strokeWidth="0.2"/>
                    <circle cx="66" cy="114" r="0.5" fill="#D4A574" stroke="#B8860B" strokeWidth="0.2"/>
                    
                    {/* Joint markers for key acupuncture areas */}
                    <circle cx="38" cy="40" r="0.8" fill="#FFD700" opacity="0.8"/>
                    <circle cx="62" cy="40" r="0.8" fill="#FFD700" opacity="0.8"/>
                    <circle cx="26" cy="55" r="0.8" fill="#FFD700" opacity="0.8"/>
                    <circle cx="74" cy="55" r="0.8" fill="#FFD700" opacity="0.8"/>
                  </>
                ) : (
                  // BACK VIEW - Anatomical Skeleton Model
                  <>
                    {/* Skull (posterior view) */}
                    <g id="skullBack">
                      {/* Occipital bone */}
                      <ellipse cx="50" cy="8" rx="8" ry="6" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.3"/>
                      {/* External occipital protuberance */}
                      <circle cx="50" cy="12" r="1" fill="#E0E0E0" stroke="#C0C0C0" strokeWidth="0.2"/>
                      {/* Superior nuchal line */}
                      <path d="M 44 10 Q 50 11 56 10" stroke="#C0C0C0" strokeWidth="0.3" fill="none"/>
                    </g>
                    
                    {/* Cervical vertebrae (posterior view) */}
                    <g id="cervicalBack">
                      {/* C1-C7 spinous processes */}
                      <circle cx="50" cy="16" r="0.4" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.2"/>
                      <circle cx="50" cy="18" r="0.4" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.2"/>
                      <circle cx="50" cy="20" r="0.4" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.2"/>
                      <circle cx="50" cy="22" r="0.5" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.2"/>
                      <circle cx="50" cy="24" r="0.5" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.2"/>
                      <circle cx="50" cy="26" r="0.5" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.2"/>
                    </g>
                    
                    {/* Scapulae (shoulder blades) */}
                    <g id="scapulae">
                      {/* Left scapula */}
                      <path d="M 36 28 Q 32 32 34 40 Q 36 44 40 42 Q 42 38 40 32 Q 38 28 36 28 Z" 
                            fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.5"/>
                      {/* Right scapula */}
                      <path d="M 64 28 Q 68 32 66 40 Q 64 44 60 42 Q 58 38 60 32 Q 62 28 64 28 Z" 
                            fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.5"/>
                      {/* Scapular spines */}
                      <line x1="36" y1="30" x2="42" y2="32" stroke="#C0C0C0" strokeWidth="0.4"/>
                      <line x1="64" y1="30" x2="58" y2="32" stroke="#C0C0C0" strokeWidth="0.4"/>
                    </g>
                    
                    {/* Thoracic and lumbar spine */}
                    <g id="spineBack">
                      {/* Thoracic vertebrae (T1-T12) */}
                      <circle cx="50" cy="28" r="0.6" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      <circle cx="50" cy="31" r="0.6" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      <circle cx="50" cy="34" r="0.6" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      <circle cx="50" cy="37" r="0.6" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      <circle cx="50" cy="40" r="0.6" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      <circle cx="50" cy="43" r="0.6" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      
                      {/* Lumbar vertebrae (L1-L5) */}
                      <circle cx="50" cy="46" r="0.7" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      <circle cx="50" cy="49" r="0.7" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      <circle cx="50" cy="52" r="0.7" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      <circle cx="50" cy="55" r="0.7" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      <circle cx="50" cy="58" r="0.7" fill="#E0E0E0" stroke="#D3D3D3" strokeWidth="0.3"/>
                      
                      {/* Spinal column line */}
                      <line x1="50" y1="16" x2="50" y2="60" stroke="#D3D3D3" strokeWidth="0.8" opacity="0.6"/>
                    </g>
                    
                    {/* Ribs (posterior view) */}
                    <g id="ribsBack">
                      {/* Rib arcs from spine */}
                      <path d="M 50 28 Q 45 30 42 35 Q 45 40 50 38" stroke="#D3D3D3" strokeWidth="0.6" fill="none"/>
                      <path d="M 50 28 Q 55 30 58 35 Q 55 40 50 38" stroke="#D3D3D3" strokeWidth="0.6" fill="none"/>
                      <path d="M 50 31 Q 44 33 40 38 Q 44 43 50 41" stroke="#D3D3D3" strokeWidth="0.6" fill="none"/>
                      <path d="M 50 31 Q 56 33 60 38 Q 56 43 50 41" stroke="#D3D3D3" strokeWidth="0.6" fill="none"/>
                      <path d="M 50 34 Q 43 36 38 41 Q 43 46 50 44" stroke="#D3D3D3" strokeWidth="0.6" fill="none"/>
                      <path d="M 50 34 Q 57 36 62 41 Q 57 46 50 44" stroke="#D3D3D3" strokeWidth="0.6" fill="none"/>
                    </g>
                    
                    {/* Pelvis (posterior view) */}
                    <g id="pelvisBack">
                      {/* Sacrum */}
                      <path d="M 47 58 L 53 58 L 52 68 L 48 68 Z" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.4"/>
                      {/* Sacral foramina */}
                      <circle cx="49" cy="60" r="0.3" fill="#E0E0E0"/>
                      <circle cx="51" cy="60" r="0.3" fill="#E0E0E0"/>
                      <circle cx="49" cy="63" r="0.3" fill="#E0E0E0"/>
                      <circle cx="51" cy="63" r="0.3" fill="#E0E0E0"/>
                      
                      {/* Iliac crests */}
                      <path d="M 38 60 Q 42 58 47 60" stroke="#D3D3D3" strokeWidth="1" fill="none"/>
                      <path d="M 62 60 Q 58 58 53 60" stroke="#D3D3D3" strokeWidth="1" fill="none"/>
                    </g>
                    
                    {/* Arms (posterior view) */}
                    <g id="armsBack">
                      {/* Left arm */}
                      <line x1="40" y1="30" x2="32" y2="45" stroke="#D3D3D3" strokeWidth="2"/>
                      <line x1="32" y1="47" x2="28" y2="62" stroke="#D3D3D3" strokeWidth="1.5"/>
                      <circle cx="32" cy="45" r="1.5" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.3"/>
                      
                      {/* Right arm */}
                      <line x1="60" y1="30" x2="68" y2="45" stroke="#D3D3D3" strokeWidth="2"/>
                      <line x1="68" y1="47" x2="72" y2="62" stroke="#D3D3D3" strokeWidth="1.5"/>
                      <circle cx="68" cy="45" r="1.5" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.3"/>
                    </g>
                    
                    {/* Legs (posterior view) */}
                    <g id="legsBack">
                      {/* Left leg */}
                      <line x1="45" y1="68" x2="42" y2="85" stroke="#D3D3D3" strokeWidth="2.5"/>
                      <line x1="42" y1="87" x2="40" y2="104" stroke="#D3D3D3" strokeWidth="2"/>
                      <circle cx="42" cy="85" r="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.4"/>
                      
                      {/* Right leg */}
                      <line x1="55" y1="68" x2="58" y2="85" stroke="#D3D3D3" strokeWidth="2.5"/>
                      <line x1="58" y1="87" x2="60" y2="104" stroke="#D3D3D3" strokeWidth="2"/>
                      <circle cx="58" cy="85" r="2" fill="#F5F5DC" stroke="#D3D3D3" strokeWidth="0.4"/>
                      
                      {/* Achilles tendons */}
                      <line x1="40" y1="104" x2="38" y2="108" stroke="#D3D3D3" strokeWidth="1"/>
                      <line x1="60" y1="104" x2="62" y2="108" stroke="#D3D3D3" strokeWidth="1"/>
                    </g>
                  </>
                )}
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
            </div>            <div className="text-center text-gray-400 text-sm mt-6">
              <p>Tap on a body region to view available points.</p>
              <p className="mt-2 text-yellow-400">
                <span className="font-semibold">{viewSide.toUpperCase()} VIEW</span>
                {viewSide === 'back' && <span className="block text-xs mt-1">
                  Great for Bladder & Governing Vessel meridians
                </span>}
              </p>
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
            </div>            {/* Anatomical Diagram for Region */}
            <div className="relative bg-gray-900 rounded-lg p-6 border border-yellow-600">
              <svg viewBox="0 0 100 100" className="w-full h-64 mx-auto">
                {/* Region-specific anatomy */}
                {selectedRegion === 'HEAD & NECK' && (
                  <>
                    {/* Head shape */}
                    <ellipse cx="50" cy="35" rx="18" ry="22" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    {/* Neck */}
                    <rect x="45" y="57" width="10" height="15" rx="3" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    {/* Facial features */}
                    <circle cx="44" cy="30" r="1.5" fill="#8B4513"/>
                    <circle cx="56" cy="30" r="1.5" fill="#8B4513"/>
                    <path d="M 46 40 Q 50 42 54 40" stroke="#8B4513" strokeWidth="1" fill="none"/>
                    {/* Hair outline */}
                    <path d="M 35 20 Q 50 15 65 20 Q 65 25 60 30 L 40 30 Q 35 25 35 20" 
                          fill="#654321" stroke="#D4AF37" strokeWidth="0.5"/>
                  </>
                )}
                {selectedRegion === 'ARMS' && (
                  <>
                    {/* Left arm detailed */}
                    <ellipse cx="25" cy="30" rx="6" ry="18" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="20" cy="55" rx="5" ry="15" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="18" cy="75" rx="4" ry="8" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    
                    {/* Right arm detailed */}
                    <ellipse cx="75" cy="30" rx="6" ry="18" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="80" cy="55" rx="5" ry="15" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="82" cy="75" rx="4" ry="8" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    
                    {/* Joint markers */}
                    <circle cx="25" cy="48" r="2" fill="#B8860B" opacity="0.8"/>
                    <circle cx="75" cy="48" r="2" fill="#B8860B" opacity="0.8"/>
                    <circle cx="20" cy="70" r="1.5" fill="#B8860B" opacity="0.8"/>
                    <circle cx="80" cy="70" r="1.5" fill="#B8860B" opacity="0.8"/>
                  </>
                )}
                {selectedRegion === 'TRUNK' && (
                  <>
                    {/* Torso with more detail */}
                    <path d="M 35 20 Q 30 35 32 50 Q 35 65 40 75 L 60 75 Q 65 65 68 50 Q 70 35 65 20 Z" 
                          fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    {/* Ribcage outline */}
                    <path d="M 38 25 Q 50 22 62 25 Q 62 35 60 45 Q 50 48 40 45 Q 38 35 38 25" 
                          stroke="#B8860B" strokeWidth="0.8" fill="none" opacity="0.6"/>
                    {/* Spine indication */}
                    <line x1="50" y1="25" x2="50" y2="70" stroke="#B8860B" strokeWidth="1" opacity="0.7"/>
                    {/* Shoulder areas */}
                    <circle cx="35" cy="25" r="3" fill="#B8860B" opacity="0.6"/>
                    <circle cx="65" cy="25" r="3" fill="#B8860B" opacity="0.6"/>
                  </>
                )}
                {selectedRegion === 'LEGS' && (
                  <>
                    {/* Left leg with thigh and calf definition */}
                    <ellipse cx="42" cy="35" rx="6" ry="20" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="40" cy="65" rx="5" ry="18" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    
                    {/* Right leg */}
                    <ellipse cx="58" cy="35" rx="6" ry="20" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="60" cy="65" rx="5" ry="18" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    
                    {/* Knee joints */}
                    <circle cx="42" cy="55" r="2.5" fill="#B8860B" opacity="0.8"/>
                    <circle cx="58" cy="55" r="2.5" fill="#B8860B" opacity="0.8"/>
                    
                    {/* Hip connection */}
                    <ellipse cx="50" cy="20" rx="8" ry="4" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                  </>
                )}
                {selectedRegion === 'FEET' && (
                  <>
                    {/* Left foot detailed */}
                    <ellipse cx="35" cy="40" rx="12" ry="6" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="30" cy="45" rx="3" ry="2" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                    <ellipse cx="32" cy="48" rx="2" ry="1.5" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                    <ellipse cx="34" cy="50" rx="1.5" ry="1" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                    <ellipse cx="36" cy="52" rx="1.5" ry="1" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                    <ellipse cx="38" cy="53" rx="1.5" ry="1" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                    
                    {/* Right foot detailed */}
                    <ellipse cx="65" cy="40" rx="12" ry="6" fill="#D4A574" stroke="#D4AF37" strokeWidth="1"/>
                    <ellipse cx="70" cy="45" rx="3" ry="2" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                    <ellipse cx="68" cy="48" rx="2" ry="1.5" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                    <ellipse cx="66" cy="50" rx="1.5" ry="1" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                    <ellipse cx="64" cy="52" rx="1.5" ry="1" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                    <ellipse cx="62" cy="53" rx="1.5" ry="1" fill="#D4A574" stroke="#D4AF37" strokeWidth="0.5"/>
                    
                    {/* Ankle areas */}
                    <circle cx="40" cy="30" r="2" fill="#B8860B" opacity="0.6"/>
                    <circle cx="60" cy="30" r="2" fill="#B8860B" opacity="0.6"/>
                  </>
                )}

                {/* Display points for selected meridian */}
                {selectedMeridian && getPointsForMeridian(selectedRegion, selectedMeridian).map((point, index) => {
                  const position = getPointPosition(index, getPointsForMeridian(selectedRegion, selectedMeridian).length, selectedRegion)
                  const isSelected = selectedPoint?.id === point.id
                  return (
                    <g key={point.id}>
                      {/* Point highlight effect */}
                      {isSelected && (
                        <circle
                          cx={position.x}
                          cy={position.y}
                          r="4"
                          fill="none"
                          stroke="#FBBF24"
                          strokeWidth="1"
                          opacity="0.5"
                        >
                          <animate
                            attributeName="r"
                            from="4"
                            to="6"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.5"
                            to="0"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                      {/* Main point circle */}
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={isSelected ? "3" : "2"}
                        fill={getMeridianColor(point.meridian)}
                        stroke={isSelected ? "#FBBF24" : "#FFFFFF"}
                        strokeWidth={isSelected ? "2" : "1"}
                        className="cursor-pointer transition-all duration-200"
                        onClick={() => handlePointSelect(point)}
                      >
                        <title>{`${point.number} - ${point.nameEnglish}`}</title>
                      </circle>
                    </g>
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
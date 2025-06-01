import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'

const BodyMap = ({ navigateTo }) => {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [viewSide, setViewSide] = useState('front')

  // Mock data for pressure points
  const mockPressurePoints = [
    { id: 1, name: "Temporal", location: "Temple", meridian: "Gallbladder", x: 35, y: 8, side: 'front' },
    { id: 2, name: "Carotid", location: "Neck", meridian: "Stomach", x: 46, y: 24, side: 'front' },
    { id: 3, name: "Liver", location: "Right Side", meridian: "Liver", x: 58, y: 45, side: 'front' },
    { id: 4, name: "Solar Plexus", location: "Upper Abdomen", meridian: "Conception Vessel", x: 50, y: 42, side: 'front' },
    { id: 5, name: "Kidney", location: "Lower Back", meridian: "Kidney", x: 50, y: 50, side: 'back' },
    { id: 6, name: "Spine Base", location: "Lower Spine", meridian: "Governing Vessel", x: 50, y: 58, side: 'back' }
  ]

  // Body regions for organization
  const bodyRegions = {
    head: "Head & Neck",
    torso: "Chest & Abdomen", 
    arms: "Arms & Hands",
    legs: "Legs & Feet"
  }

  const getPointsForRegion = (region) => {
    const regionMappings = {
      head: ['Temporal', 'Carotid'],
      torso: ['Liver', 'Solar Plexus', 'Kidney', 'Spine Base'],
      arms: [],
      legs: []
    }
    
    return mockPressurePoints.filter(point => 
      regionMappings[region]?.includes(point.name) || false
    )
  }

  const getCurrentViewPoints = () => {
    return mockPressurePoints.filter(point => point.side === viewSide)
  }

  const handlePointSelect = (point) => {
    setSelectedPoint(point)
  }

  const handleRegionSelect = (region) => {
    setSelectedRegion(selectedRegion === region ? null : region)
  }

  const handleMeridianSelect = (meridian) => {
    console.log(`Selected meridian: ${meridian}`)
  }

  const getMeridianColor = (meridian) => {
    const colors = {
      'Gallbladder': '#FF6B6B',
      'Stomach': '#4ECDC4', 
      'Liver': '#45B7D1',
      'Conception Vessel': '#FFA07A',
      'Kidney': '#98D8C8',
      'Governing Vessel': '#F7DC6F'
    }
    return colors[meridian] || '#6366F1'
  }

  // Get unique meridians from current view points
  const getVisibleMeridians = () => {
    const points = getCurrentViewPoints()
    return [...new Set(points.map(point => point.meridian))]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => navigateTo('home')}
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Pressure Point Body Map
            </h1>
            <p className="text-gray-300 mt-2">Interactive anatomical reference</p>
          </div>
          
          <div className="w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Body Diagram */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            {/* View Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-800 rounded-lg p-1 flex">
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${ 
                    viewSide === 'front' 
                      ? 'bg-yellow-600 text-black' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setViewSide('front')}
                >
                  FRONT
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors ${ 
                    viewSide === 'back' 
                      ? 'bg-yellow-600 text-black' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setViewSide('back')}
                >
                  BACK
                </button>
              </div>
            </div>
            
            {/* Human Body Model */}
            <div className="relative">
              <svg viewBox="0 0 100 120" className="w-full h-80 mx-auto">
                {viewSide === 'front' ? (
                  // FRONT VIEW - Human Anatomical Body Model
                  <>
                    {/* Head - Natural human proportions */}
                    <g id="head">
                      {/* Face/head outline */}
                      <ellipse cx="50" cy="10" rx="6.5" ry="8" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.4"/>
                      
                      {/* Eyes */}
                      <ellipse cx="47" cy="9" rx="0.8" ry="0.5" fill="#87CEEB" stroke="#5F9EA0" strokeWidth="0.2"/>
                      <ellipse cx="53" cy="9" rx="0.8" ry="0.5" fill="#87CEEB" stroke="#5F9EA0" strokeWidth="0.2"/>
                      <circle cx="47" cy="9" r="0.3" fill="#2F4F4F"/>
                      <circle cx="53" cy="9" r="0.3" fill="#2F4F4F"/>
                      
                      {/* Nose */}
                      <path d="M 49.5 10.5 L 50.5 10.5 L 50.2 12 L 49.8 12 Z" fill="#E09F8C" stroke="#D2896F" strokeWidth="0.1"/>
                      
                      {/* Mouth */}
                      <ellipse cx="50" cy="13" rx="1" ry="0.3" fill="#CD5C5C" stroke="#B22222" strokeWidth="0.1"/>
                      
                      {/* Hair */}
                      <path d="M 43.5 5 Q 50 2 56.5 5 Q 58 8 56 12 Q 54 4 50 3 Q 46 4 44 12 Q 42 8 43.5 5 Z" 
                            fill="#8B4513" stroke="#654321" strokeWidth="0.3"/>
                    </g>
                    
                    {/* Neck */}
                    <g id="neck">
                      <rect x="47" y="18" width="6" height="8" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3" rx="1"/>
                      {/* Adam's apple (subtle) */}
                      <ellipse cx="50" cy="22" rx="0.8" ry="0.4" fill="#E09F8C" stroke="#D2896F" strokeWidth="0.2"/>
                    </g>
                    
                    {/* Torso - Body outline with anatomical landmarks */}
                    <g id="torso">
                      {/* Chest/trunk */}
                      <ellipse cx="50" cy="36" rx="12" ry="14" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.4"/>
                      
                      {/* Shoulder definition */}
                      <ellipse cx="38" cy="28" rx="3" ry="2.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      <ellipse cx="62" cy="28" rx="3" ry="2.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      
                      {/* Chest muscles (pectorals) */}
                      <ellipse cx="45" cy="32" rx="4" ry="3" fill="none" stroke="#D2896F" strokeWidth="0.3" opacity="0.6"/>
                      <ellipse cx="55" cy="32" rx="4" ry="3" fill="none" stroke="#D2896F" strokeWidth="0.3" opacity="0.6"/>
                      
                      {/* Sternum line */}
                      <line x1="50" y1="26" x2="50" y2="46" stroke="#D2896F" strokeWidth="0.3" opacity="0.5"/>
                      
                      {/* Rib definition (subtle) */}
                      <path d="M 44 30 Q 50 29 56 30" stroke="#D2896F" strokeWidth="0.2" opacity="0.4"/>
                      <path d="M 42 34 Q 50 33 58 34" stroke="#D2896F" strokeWidth="0.2" opacity="0.4"/>
                      <path d="M 43 38 Q 50 37 57 38" stroke="#D2896F" strokeWidth="0.2" opacity="0.4"/>
                    </g>
                    
                    {/* Abdomen */}
                    <g id="abdomen">
                      <ellipse cx="50" cy="52" rx="9" ry="8" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.4"/>
                      
                      {/* Abdominal muscles (subtle definition) */}
                      <line x1="50" y1="46" x2="50" y2="58" stroke="#D2896F" strokeWidth="0.3" opacity="0.5"/>
                      <path d="M 47 48 L 53 48" stroke="#D2896F" strokeWidth="0.2" opacity="0.4"/>
                      <path d="M 47 52 L 53 52" stroke="#D2896F" strokeWidth="0.2" opacity="0.4"/>
                      <path d="M 47 56 L 53 56" stroke="#D2896F" strokeWidth="0.2" opacity="0.4"/>
                      
                      {/* Navel */}
                      <circle cx="50" cy="52" r="0.6" fill="#D2896F" stroke="#B8795A" strokeWidth="0.2"/>
                    </g>
                    
                    {/* Arms */}
                    <g id="leftArm">
                      {/* Upper arm */}
                      <ellipse cx="32" cy="38" rx="3" ry="12" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3" transform="rotate(-15 32 38)"/>
                      {/* Elbow */}
                      <circle cx="28" cy="48" r="2" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Forearm */}
                      <ellipse cx="25" cy="58" rx="2.5" ry="9" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3" transform="rotate(-5 25 58)"/>
                      {/* Hand */}
                      <ellipse cx="23" cy="68" rx="2" ry="4" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Fingers */}
                      <ellipse cx="22" cy="72" rx="1.5" ry="2" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.2"/>
                    </g>
                    
                    <g id="rightArm">
                      {/* Upper arm */}
                      <ellipse cx="68" cy="38" rx="3" ry="12" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3" transform="rotate(15 68 38)"/>
                      {/* Elbow */}
                      <circle cx="72" cy="48" r="2" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Forearm */}
                      <ellipse cx="75" cy="58" rx="2.5" ry="9" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3" transform="rotate(5 75 58)"/>
                      {/* Hand */}
                      <ellipse cx="77" cy="68" rx="2" ry="4" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Fingers */}
                      <ellipse cx="78" cy="72" rx="1.5" ry="2" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.2"/>
                    </g>
                    
                    {/* Legs */}
                    <g id="leftLeg">
                      {/* Thigh */}
                      <ellipse cx="45" cy="72" rx="4" ry="14" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Knee */}
                      <ellipse cx="44" cy="85" rx="3" ry="2" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Shin/calf */}
                      <ellipse cx="43" cy="98" rx="3" ry="12" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Ankle */}
                      <circle cx="42" cy="108" r="1.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Foot */}
                      <ellipse cx="40" cy="112" rx="4" ry="2.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                    </g>
                    
                    <g id="rightLeg">
                      {/* Thigh */}
                      <ellipse cx="55" cy="72" rx="4" ry="14" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Knee */}
                      <ellipse cx="56" cy="85" rx="3" ry="2" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Shin/calf */}
                      <ellipse cx="57" cy="98" rx="3" ry="12" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Ankle */}
                      <circle cx="58" cy="108" r="1.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Foot */}
                      <ellipse cx="60" cy="112" rx="4" ry="2.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                    </g>
                  </>
                ) : (
                  // BACK VIEW - Human Anatomical Body Model
                  <>
                    {/* Head (back view) */}
                    <g id="headBack">
                      {/* Back of head outline */}
                      <ellipse cx="50" cy="10" rx="6.5" ry="8" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.4"/>
                      
                      {/* Hair (back) */}
                      <path d="M 43.5 5 Q 50 2 56.5 5 Q 58 8 56 12 Q 54 4 50 3 Q 46 4 44 12 Q 42 8 43.5 5 Z" 
                            fill="#8B4513" stroke="#654321" strokeWidth="0.3"/>
                      
                      {/* Ears */}
                      <ellipse cx="43" cy="10" rx="1" ry="1.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.2"/>
                      <ellipse cx="57" cy="10" rx="1" ry="1.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.2"/>
                    </g>
                    
                    {/* Neck (back) */}
                    <g id="neckBack">
                      <rect x="47" y="18" width="6" height="8" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3" rx="1"/>
                      {/* Cervical vertebrae (subtle indication) */}
                      <line x1="50" y1="18" x2="50" y2="26" stroke="#D2896F" strokeWidth="0.3" opacity="0.4"/>
                    </g>
                    
                    {/* Back torso */}
                    <g id="backTorso">
                      {/* Back outline */}
                      <ellipse cx="50" cy="36" rx="12" ry="14" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.4"/>
                      
                      {/* Shoulder blades */}
                      <ellipse cx="42" cy="32" rx="4" ry="6" fill="none" stroke="#D2896F" strokeWidth="0.3" opacity="0.6" transform="rotate(-10 42 32)"/>
                      <ellipse cx="58" cy="32" rx="4" ry="6" fill="none" stroke="#D2896F" strokeWidth="0.3" opacity="0.6" transform="rotate(10 58 32)"/>
                      
                      {/* Spine line */}
                      <line x1="50" y1="26" x2="50" y2="58" stroke="#D2896F" strokeWidth="0.4" opacity="0.6"/>
                      
                      {/* Lat muscles */}
                      <path d="M 38 40 Q 35 45 38 50" stroke="#D2896F" strokeWidth="0.3" opacity="0.4"/>
                      <path d="M 62 40 Q 65 45 62 50" stroke="#D2896F" strokeWidth="0.3" opacity="0.4"/>
                    </g>
                    
                    {/* Lower back */}
                    <g id="lowerBack">
                      <ellipse cx="50" cy="52" rx="9" ry="8" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.4"/>
                      
                      {/* Lower spine */}
                      <line x1="50" y1="46" x2="50" y2="58" stroke="#D2896F" strokeWidth="0.4" opacity="0.6"/>
                      
                      {/* Lower back muscles */}
                      <ellipse cx="45" cy="52" rx="3" ry="4" fill="none" stroke="#D2896F" strokeWidth="0.2" opacity="0.4"/>
                      <ellipse cx="55" cy="52" rx="3" ry="4" fill="none" stroke="#D2896F" strokeWidth="0.2" opacity="0.4"/>
                    </g>
                    
                    {/* Arms (back view) */}
                    <g id="leftArmBack">
                      {/* Upper arm */}
                      <ellipse cx="32" cy="38" rx="3" ry="12" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3" transform="rotate(-15 32 38)"/>
                      {/* Elbow */}
                      <circle cx="28" cy="48" r="2" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Forearm */}
                      <ellipse cx="25" cy="58" rx="2.5" ry="9" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3" transform="rotate(-5 25 58)"/>
                      {/* Hand */}
                      <ellipse cx="23" cy="68" rx="2" ry="4" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                    </g>
                    
                    <g id="rightArmBack">
                      {/* Upper arm */}
                      <ellipse cx="68" cy="38" rx="3" ry="12" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3" transform="rotate(15 68 38)"/>
                      {/* Elbow */}
                      <circle cx="72" cy="48" r="2" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Forearm */}
                      <ellipse cx="75" cy="58" rx="2.5" ry="9" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3" transform="rotate(5 75 58)"/>
                      {/* Hand */}
                      <ellipse cx="77" cy="68" rx="2" ry="4" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                    </g>
                    
                    {/* Legs (back view) */}
                    <g id="leftLegBack">
                      {/* Thigh */}
                      <ellipse cx="45" cy="72" rx="4" ry="14" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Knee */}
                      <ellipse cx="44" cy="85" rx="3" ry="2" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Calf */}
                      <ellipse cx="43" cy="98" rx="3" ry="12" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Ankle */}
                      <circle cx="42" cy="108" r="1.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Foot */}
                      <ellipse cx="40" cy="112" rx="4" ry="2.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                    </g>
                    
                    <g id="rightLegBack">
                      {/* Thigh */}
                      <ellipse cx="55" cy="72" rx="4" ry="14" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Knee */}
                      <ellipse cx="56" cy="85" rx="3" ry="2" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Calf */}
                      <ellipse cx="57" cy="98" rx="3" ry="12" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Ankle */}
                      <circle cx="58" cy="108" r="1.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                      {/* Foot */}
                      <ellipse cx="60" cy="112" rx="4" ry="2.5" fill="#FDBCB4" stroke="#E09F8C" strokeWidth="0.3"/>
                    </g>
                  </>
                )}
                
                {/* Pressure Points */}
                {getCurrentViewPoints().map((point, index) => (
                  <circle
                    key={point.id}
                    cx={point.x}
                    cy={point.y}
                    r="1.5"
                    fill={getMeridianColor(point.meridian)}
                    stroke="white"
                    strokeWidth="0.5"
                    className="cursor-pointer hover:r-2 transition-all"
                    onClick={() => handlePointSelect(point)}
                  />
                ))}
              </svg>
            </div>

            {/* Region Buttons */}
            <div className="space-y-3">
              {Object.keys(bodyRegions).map((region) => {
                const pointCount = getPointsForRegion(region).length
                return (
                  <button
                    key={region}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${ 
                      selectedRegion === region 
                        ? 'bg-yellow-600/20 border-yellow-500' 
                        : 'bg-white/5 hover:bg-white/10'
                    } border border-white/10`}
                    onClick={() => handleRegionSelect(region)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{bodyRegions[region]}</span>
                      {pointCount > 0 && (
                        <span className="bg-yellow-600 text-black px-2 py-1 rounded-full text-xs">
                          {pointCount}
                        </span>
                      )}
                    </div>
                    {viewSide === 'back' && <span className="block text-xs mt-1">
                      Posterior view - {region}
                    </span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Current View Info */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Current View
                </span>
              </h3>
              <div className="text-center">
                <button
                  className="bg-gray-800 text-yellow-400 px-4 py-2 rounded-lg"
                  onClick={() => setSelectedRegion(null)}
                >
                  {viewSide.toUpperCase()} VIEW
                </button>
                <p className="text-gray-300 text-sm mt-2">
                  {getCurrentViewPoints().length} pressure points visible
                </p>
              </div>
            </div>

            {/* Selected Point Details */}
            {selectedPoint && (
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Point Details
                  </span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-300">Name:</span>
                    <p className="font-medium">{selectedPoint.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-300">Location:</span>
                    <p className="font-medium">{selectedPoint.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-300">Meridian:</span>
                    <p className="font-medium" style={{color: getMeridianColor(selectedPoint.meridian)}}>
                      {selectedPoint.meridian}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Meridian Legend */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Meridian Legend
                </span>
              </h3>
              <div className="space-y-2">
                {getVisibleMeridians().map((meridian) => (
                  <button
                    key={meridian}
                    className="flex items-center space-x-3 w-full text-left p-2 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => handleMeridianSelect(meridian)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{backgroundColor: getMeridianColor(meridian)}}
                    ></div>
                    <span className="text-sm">{meridian}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Instructions
                </span>
              </h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Click pressure points for details</li>
                <li>• Switch between front/back views</li>
                <li>• Select body regions to filter points</li>
                <li>• Use meridian legend for reference</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BodyMap

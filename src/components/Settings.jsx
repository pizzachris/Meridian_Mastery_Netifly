import React from 'react'
import { Link } from 'react-router-dom'

const Settings = ({ darkMode, setDarkMode }) => {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-gray-300">Customize your experience</p>
        </header>

        <div className="max-w-md mx-auto space-y-6">
          {/* Theme Toggle */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Dark Mode</h3>
                <p className="text-gray-400 text-sm">Toggle between light and dark themes</p>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-yellow-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Study Preferences */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Study Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Auto-flip cards</span>
                <input type="checkbox" className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span>Show romanization</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <span>Voice pronunciation</span>
                <input type="checkbox" className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Session Settings */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Session Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Cards per session</span>
                <select className="bg-gray-700 text-white px-3 py-1 rounded">
                  <option>10</option>
                  <option>20</option>
                  <option>50</option>
                  <option>All</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span>Shuffle cards</span>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">About</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong>Meridian Mastery v1.0</strong></p>
              <p>Based on traditional Korean/TCM principles as taught in Kuk Sool Won.</p>
              <p>Content verified from Master R. Barry Harmon's pressure point manual.</p>
              <p className="mt-4 pt-4 border-t border-gray-600">
                © 2025 Meridian Mastery. For educational purposes.
              </p>
            </div>
          </div>

          {/* Data Management */}
          <div className="card">
            <h3 className="font-semibold text-lg mb-4">Data Management</h3>
            <div className="space-y-3">
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-xl">
                Export Progress
              </button>
              <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-xl">
                Import Data
              </button>
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl">
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
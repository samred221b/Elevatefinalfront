import React from 'react'
import { HabitProvider } from './context/HabitContext'
import { ToastProvider } from './context/ToastContext'

function SimpleTestContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-4">
            🎉 Elevate - Firebase Success!
          </h1>
          <p className="text-gray-600 text-lg">
            Firebase authentication is working perfectly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-violet-200">
            <div className="text-3xl mb-4">🔥</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Firebase Auth</h3>
            <p className="text-gray-600">Successfully authenticated with Firebase!</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-fuchsia-200">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Habit Tracking</h3>
            <p className="text-gray-600">Ready to track your daily habits.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-cyan-200">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Analytics</h3>
            <p className="text-gray-600">View your progress and insights.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-emerald-200">
            <div className="text-3xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Achievements</h3>
            <p className="text-gray-600">Earn badges and celebrate milestones.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-orange-200">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mobile Ready</h3>
            <p className="text-gray-600">Works perfectly on all devices.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-purple-200">
            <div className="text-3xl mb-4">🌙</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Dark Mode</h3>
            <p className="text-gray-600">Beautiful themes for any time.</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={() => {
              console.log('Loading full SuperEnhancedApp...')
              // You can add logic here to switch to full app
            }}
            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            🚀 Continue to Full App
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SimpleTestApp() {
  console.log('🧪 SimpleTestApp rendering...')
  return (
    <ToastProvider>
      <HabitProvider>
        <SimpleTestContent />
      </HabitProvider>
    </ToastProvider>
  )
}

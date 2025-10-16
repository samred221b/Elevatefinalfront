import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import SuperEnhancedApp from './SuperEnhancedApp';
import { Sparkles } from 'lucide-react';

export function ElevateApp() {
  const { isAuthenticated, isAuthLoading, isLoggingOut, user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  // Check if this is a first-time login (only run once when user is set)
  useEffect(() => {
    if (user) {
      const hasSeenWelcome = localStorage.getItem('elevate_welcome_seen');
      const forceWelcome = window.location.search.includes('welcome=true');
      
      if (!hasSeenWelcome || forceWelcome) {
        setShowWelcome(true);
        
        if (!forceWelcome) {
          localStorage.setItem('elevate_welcome_seen', 'true');
        }
        
        // Auto-hide welcome after 3 seconds
        const timer = setTimeout(() => {
          setShowWelcome(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [user]);

  // Clean up login parameter in URL without causing re-renders
  useEffect(() => {
    if (isAuthenticated && window.location.search.includes('login=true')) {
      const url = new URL(window.location.href);
      url.searchParams.delete('login');
      window.history.replaceState({}, '', url.toString());
    }
  }, [isAuthenticated]);

  // Show advanced habit-themed logout animation
  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-violet-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Background habit pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full"></div>
          <div className="absolute top-40 right-32 w-6 h-6 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full"></div>
          <div className="absolute bottom-32 left-40 w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
        </div>

        <div className="text-center space-y-8 relative z-10">
          {/* Advanced habit completion animation */}
          <div className="relative mx-auto w-32 h-32">
            {/* Outer habit ring */}
            <div className="absolute inset-0 border-4 border-indigo-200/50 dark:border-indigo-800/50 rounded-full"></div>
            
            {/* Animated progress ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
            
            {/* Inner habit completion ring */}
            <div className="absolute inset-4 border-3 border-violet-200/50 dark:border-violet-800/50 rounded-full"></div>
            <div className="absolute inset-4 border-3 border-transparent border-t-violet-600 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            
            {/* Center habit icon */}
            <div className="absolute inset-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            
            {/* Habit streak indicators */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-green-500 rounded-full animate-bounce shadow-lg shadow-green-500/30"></div>
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200 shadow-lg shadow-blue-500/30"></div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-400 shadow-lg shadow-purple-500/30"></div>
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full animate-bounce delay-600 shadow-lg shadow-orange-500/30"></div>
          </div>

          {/* Enhanced logout message */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Saving your progress...
              </span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300"></div>
                <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce delay-400"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-500"></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Your habits are secure! 🎯
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                Thanks for building amazing habits with Elevate. Your progress has been saved and we'll be here when you return! 
              </p>
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                Keep elevating! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show advanced habit-themed login loading screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
        {/* Background habit elements */}
        <div className="absolute inset-0 opacity-8">
          <div className="absolute top-32 left-32 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full"></div>
          <div className="absolute top-48 right-40 w-4 h-4 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full"></div>
          <div className="absolute bottom-40 left-48 w-8 h-8 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
        </div>

        <div className="text-center space-y-6 relative z-10">
          {/* Advanced habit building animation */}
          <div className="relative mx-auto w-24 h-24">
            {/* Outer habit tracking ring */}
            <div className="absolute inset-0 border-4 border-indigo-200/60 dark:border-indigo-800/60 rounded-full"></div>
            
            {/* Main progress ring */}
            <div className="absolute inset-0 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
            
            {/* Inner habit completion ring */}
            <div className="absolute inset-3 border-3 border-violet-200/50 dark:border-violet-800/50 rounded-full"></div>
            <div className="absolute inset-3 border-3 border-transparent border-t-violet-600 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '2s'}}></div>
            
            {/* Center habit icon */}
            <div className="absolute inset-6 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
            </div>
            
            {/* Habit streak indicators */}
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-500 rounded-full animate-bounce shadow-lg shadow-green-500/30"></div>
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150 shadow-lg shadow-blue-500/30"></div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-300 shadow-lg shadow-purple-500/30"></div>
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full animate-bounce delay-450 shadow-lg shadow-orange-500/30"></div>
          </div>

          {/* Enhanced authentication message */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-200"></div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Accessing your habits...
              </span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-300"></div>
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-bounce delay-400"></div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-500"></div>
              </div>
            </div>
            
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Loading your progress and streaks 🎯
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication page if not logged in
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Show main app - temporarily simplified without HabitContext to prevent blinking
  return (
    <div className="relative">
      {/* Welcome overlay for first-time users */}
      {showWelcome && user && (
        <div 
          className={`fixed inset-0 z-50 bg-gradient-to-br from-violet-600/95 to-fuchsia-600/95 backdrop-blur-sm flex items-center justify-center transition-all duration-500 ${
            showWelcome ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="text-center text-white space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <div className="text-6xl animate-bounce">🎯</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome to Elevate!</h1>
              <p className="text-xl text-violet-100">Ready to build amazing habits, {user.name}?</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-violet-200">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <span>Let's get started...</span>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <button
              onClick={() => setShowWelcome(false)}
              className="mt-6 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white/80 hover:text-white transition-all duration-200 text-sm"
            >
              Skip Welcome
            </button>
          </div>
        </div>
      )}

      {/* Main Habit Tracking App */}
      <SuperEnhancedApp />
    </div>
  );
}

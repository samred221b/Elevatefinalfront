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

  // Show logout animation
  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto">
              <div className="absolute inset-0 border-4 border-violet-200 dark:border-violet-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
              <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              <span className="text-lg font-medium">Logging out...</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Thanks for using Elevate! See you soon 👋
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Only show loading screen for login attempts, not initialization
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-violet-200 dark:border-violet-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            <span>Authenticating...</span>
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

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/FirebaseAuthContext';
import { useHabits } from '../../context/HabitContext';
import { useNavigation } from '../../context/NavigationContext';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { 
  Sun, 
  Moon, 
  ArrowLeft,
  LogOut,
  Filter,
  HelpCircle,
  CreditCard,
  Search,
  Bell,
  User,
  Settings
} from 'lucide-react';

interface EnhancedTopNavProps {
  showSearch?: boolean;
}

export function EnhancedTopNav({ showSearch = true }: EnhancedTopNavProps) {
  const { 
    searchTerm, 
    setSearchTerm, 
    currentView, 
    setCurrentView,
    canGoBack, 
    goBack,
    isTransitioning 
  } = useNavigation();
  
  const { currentUser, logout, logoutLoading } = useAuth();
  const { settings, updateSettings } = useHabits();
  
  // State for logout confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Get current theme state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (settings.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return settings.theme === 'dark';
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'completed' | 'pending'>('all');
  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    updateSettings({ theme: newTheme });
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync dark mode state with settings
  useEffect(() => {
    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);
      
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
        document.documentElement.classList.toggle('dark', e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      const isDark = settings.theme === 'dark';
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [settings.theme]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showUserDropdown && !target.closest('.currentUser-dropdown')) {
        setShowUserDropdown(false);
      }
      if (showFilters && !target.closest('.filter-dropdown')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserDropdown, showFilters]);

  const getViewTitle = (view: string) => {
    const titles = {
      home: 'Habit Command Center',
      templates: 'Habit Templates',
      analytics: 'Analytics & Insights',
      calendar: 'Calendar View',
      profile: 'My Profile',
      help: 'Help & Support',
      billing: 'Billing & Subscriptions',
      settings: 'Settings',
      progress: 'Progress Tracking',
      badges: 'Achievements',
      data: 'Data Management'
    };
    return titles[view as keyof typeof titles] || 'Habit Command Center';
  };

  return (
    <>
      <div className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-purple-200/50 dark:border-purple-800/50">
        <div className="flex items-center justify-between px-3 py-2 lg:px-6 lg:py-4 min-h-[60px] lg:min-h-[70px]">
        {/* Left Section - Back Button & Title */}
        <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
          {canGoBack && (
            <button
              onClick={goBack}
              className="p-1.5 lg:p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-200 group flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
            </button>
          )}
          
          <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
            <h1 className={`text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-all duration-300 truncate ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
              {getViewTitle(currentView)}
            </h1>
          </div>
        </div>

        {/* Enhanced Center Section - Search - Hidden on small mobile */}
        {showSearch && (
          <div className="hidden sm:flex flex-1 max-w-xs md:max-w-md mx-2 lg:mx-8">
            <div className="relative group w-full">
              <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-slate-500 dark:text-slate-400 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-2 lg:py-3 rounded-xl lg:rounded-2xl
                  bg-white/80 dark:bg-gray-800/80
                  border-2 border-slate-200/30 dark:border-slate-700/30
                  text-gray-900 dark:text-gray-100
                  placeholder-slate-500/70 dark:placeholder-slate-400/70
                  focus:outline-none focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500/50
                  hover:border-slate-300/50 dark:hover:border-slate-600/50
                  transition-all duration-300
                  backdrop-blur-md shadow-lg hover:shadow-xl
                  text-xs lg:text-sm font-medium
                "
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-slate-100 dark:bg-slate-800/50 hover:bg-teal-100 dark:hover:bg-teal-900/50 flex items-center justify-center transition-colors"
                >
                  <span className="text-slate-600 dark:text-slate-400 text-xs lg:text-sm">×</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Section - Compact Actions */}
        <div className="flex items-center gap-1 lg:gap-3 flex-shrink-0">

          {/* Mobile Search Button - Hidden */}

          {/* Action Buttons - Hidden on mobile */}
          <div className="relative filter-dropdown hidden lg:block">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowFilters(!showFilters);
              }}
              className="p-1.5 lg:p-2.5 rounded-lg lg:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
              title="Filter Options"
            >
              <Filter className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
            </button>
            
            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-purple-200/50 dark:border-purple-800/50 py-2 z-50">
                <div className="px-4 py-2 border-b border-purple-200/30 dark:border-purple-800/30">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Filter Options</p>
                </div>
                <div className="py-2">
                  <button 
                    onClick={() => {
                      setFilterType('all');
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm ${
                      filterType === 'all' 
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Show All Habits
                  </button>
                  <button 
                    onClick={() => {
                      setFilterType('active');
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm ${
                      filterType === 'active' 
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Active Only
                  </button>
                  <button 
                    onClick={() => {
                      setFilterType('completed');
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm ${
                      filterType === 'completed' 
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Completed Today
                  </button>
                  <button 
                    onClick={() => {
                      setFilterType('pending');
                      setShowFilters(false);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm ${
                      filterType === 'pending' 
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Pending
                  </button>
                </div>
              </div>
            )}
          </div>


          <button
            onClick={toggleDarkMode}
            className="p-1.5 lg:p-2.5 rounded-lg lg:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
            ) : (
              <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
            )}
          </button>

          {/* Notifications - Hidden on small mobile */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 lg:p-2.5 rounded-lg lg:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors relative group"
            >
              <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-xs text-white font-bold">2</span>
              </div>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-purple-200/50 dark:border-purple-800/50 py-2 animate-in slide-in-from-top-2 fade-in-0 duration-200">
                <div className="px-4 py-2 border-b border-purple-200/30 dark:border-purple-800/30">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 animate-pulse" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          🎉 Great job! You've completed your morning routine.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          🔥 You're on a 5-day streak! Keep it up.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-2 border-t border-purple-200/30 dark:border-purple-800/30">
                  <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced User Profile - Compact on mobile */}
          <div className="flex items-center gap-1 lg:gap-2 pl-1 lg:pl-2 border-l border-purple-200/50 dark:border-purple-800/50">
            <div className="relative currentUser-dropdown">
              {currentUser?.photoURL ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserDropdown(!showUserDropdown);
                    }}
                    className="block"
                  >
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || currentUser.email || 'User'}
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
                    />
                  </button>
                  <div className="absolute -bottom-0.5 -right-0.5 lg:-bottom-1 lg:-right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserDropdown(!showUserDropdown);
                    }}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-slate-800 to-teal-500 flex items-center justify-center hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl ring-2 ring-white/20 hover:ring-white/40"
                  >
                    <span className="text-white font-bold text-xs lg:text-sm">
                      {currentUser?.displayName?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </button>
                  <div className="absolute -bottom-0.5 -right-0.5 lg:-bottom-1 lg:-right-1 w-3 h-3 lg:w-4 lg:h-4 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
                </div>
              )}
              
              {/* Simplified User Dropdown */}
              {showUserDropdown && (
                <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-purple-200/50 dark:border-purple-800/50 py-2 z-50 animate-in slide-in-from-top-2 fade-in-0 duration-200">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-purple-200/30 dark:border-purple-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {currentUser?.displayName?.charAt(0)?.toUpperCase() || currentUser?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{currentUser?.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setShowUserDropdown(false);
                        setCurrentView('profile');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Profile</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowUserDropdown(false);
                        setCurrentView('help');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-3 text-blue-600 dark:text-blue-400"
                    >
                      <HelpCircle className="w-4 h-4" />
                      <span className="text-sm">Help & Support</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowUserDropdown(false);
                        setCurrentView('billing');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center gap-3 text-green-600 dark:text-green-400"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-sm">Billing & Subscriptions</span>
                    </button>

                    <button 
                      onClick={() => {
                        setShowUserDropdown(false);
                        setCurrentView('settings');
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-3 text-gray-700 dark:text-gray-300"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-purple-200/30 dark:border-purple-800/30 my-1"></div>

                  {/* Sign Out Button */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        setShowLogoutConfirm(true);
                      }}
                      disabled={logoutLoading}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {logoutLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                          <span className="text-sm">Signing Out...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Sign Out</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && createPortal(
        <ConfirmationModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={() => {
            setShowLogoutConfirm(false);
            logout();
          }}
          title="Sign Out"
          message="Are you sure you want to sign out? You'll need to log in again to access your habits."
          confirmText="Sign Out"
          cancelText="Cancel"
          type="warning"
          icon={<LogOut className="w-6 h-6" />}
        />,
        document.body
      )}
    </>
  );
}
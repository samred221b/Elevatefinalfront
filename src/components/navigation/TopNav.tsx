import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Bell, 
  Sun, 
  Moon,
  User
} from 'lucide-react';

interface TopNavProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showSearch?: boolean;
}

export function TopNav({ searchTerm, onSearchChange, showSearch = true }: TopNavProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="hidden lg:flex sticky top-0 z-30 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-purple-200/50 dark:border-purple-800/50">
      <div className="flex-1 flex items-center justify-between px-6 py-4">
        {/* Left Section - Search */}
        {showSearch && (
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search habits, categories..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2.5 rounded-xl
                  bg-purple-50/50 dark:bg-purple-900/20
                  border border-purple-200/50 dark:border-purple-800/50
                  focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400
                  text-gray-700 dark:text-gray-300
                  placeholder-gray-500 dark:placeholder-gray-400
                  transition-all duration-200
                "
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        )}

        {/* Center Section - Spacer */}
        <div className="flex-1"></div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <button className="p-2.5 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>


          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">2</span>
              </div>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-purple-200/50 dark:border-purple-800/50 py-2">
                <div className="px-4 py-2 border-b border-purple-200/30 dark:border-purple-800/30">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                </div>
                
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-violet-500 mt-2" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          Great job! You've completed your morning routine.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          2 minutes ago
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          You're on a 5-day streak! Keep it up.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-2 border-t border-purple-200/30 dark:border-purple-800/30">
                  <button className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden xl:block">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Welcome back!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

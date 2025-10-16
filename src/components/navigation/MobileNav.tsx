import { useState, useEffect } from 'react';
import { Menu, X, Home, FileText, BarChart3, Calendar, TrendingUp, Award, Database, Settings, Bell, User } from 'lucide-react';
import { Logo } from '../ui/Logo';

type View = 'home' | 'templates' | 'analytics' | 'calendar' | 'profile' | 'help' | 'faq' | 'billing' | 'settings' | 'progress' | 'badges' | 'data';

interface MobileNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { 
    id: 'home' as View, 
    label: 'Home', 
    icon: Home, 
    color: 'from-emerald-400 to-cyan-500',
    description: 'Your habit dashboard'
  },
  { 
    id: 'templates' as View, 
    label: 'Templates', 
    icon: FileText, 
    color: 'from-blue-500 to-cyan-600',
    description: 'Pre-built habit templates'
  },
  { 
    id: 'analytics' as View, 
    label: 'Analytics', 
    icon: BarChart3, 
    color: 'from-emerald-500 to-teal-600',
    description: 'Detailed insights & stats'
  },
  { 
    id: 'calendar' as View, 
    label: 'Calendar', 
    icon: Calendar, 
    color: 'from-orange-500 to-red-600',
    description: 'Calendar view of habits'
  },
  { 
    id: 'progress' as View, 
    label: 'Progress', 
    icon: TrendingUp, 
    color: 'from-pink-500 to-rose-600',
    description: 'Track your progress'
  },
  { 
    id: 'badges' as View, 
    label: 'Badges', 
    icon: Award, 
    color: 'from-yellow-500 to-amber-600',
    description: 'Achievements & rewards'
  },
  { 
    id: 'data' as View, 
    label: 'Data', 
    icon: Database, 
    color: 'from-indigo-500 to-blue-600',
    description: 'Export & manage data'
  },
  { 
    id: 'settings' as View, 
    label: 'Settings', 
    icon: Settings, 
    color: 'from-gray-500 to-slate-600',
    description: 'App preferences'
  },
];

export function MobileNav({ currentView, onViewChange, isOpen, onToggle }: MobileNavProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-purple-200/50 dark:border-purple-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          >
            <Menu className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </button>
          
          <button 
            onClick={() => onViewChange('home')}
            className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg p-2 transition-colors group"
          >
            <Logo size="md" />
            <span className="font-black text-xl text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Elevate
            </span>
          </button>
          
          <button className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
            <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Drawer */}
      <div className={`
        fixed top-0 left-0 h-full w-80 z-50 lg:hidden
        bg-white dark:bg-gray-900 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-200/30 dark:border-purple-800/30">
          <button 
            onClick={() => {
              onViewChange('home');
              onToggle(); // Close the mobile nav after navigation
            }}
            className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg p-2 transition-colors group"
          >
            <Logo size="lg" />
            <div>
              <div className="font-black text-xl text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Elevate
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-purple-500 dark:group-hover:text-purple-300 transition-colors">
                Habit Tracker
              </div>
            </div>
          </button>
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>


        {/* Navigation Items */}
        <nav className="p-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  onToggle();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 ease-in-out
                  ${isActive 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                    : 'hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                <Icon className={`
                  w-5 h-5 transition-colors duration-200
                  ${isActive ? 'text-white' : 'text-purple-600 dark:text-purple-400'}
                `} />
                <span className={`
                  font-medium transition-colors duration-200
                  ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                `}>
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-white" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section - My Profile */}
        <div className="absolute bottom-4 left-2 right-2">
          <button
            onClick={() => {
              onViewChange('profile');
              onToggle();
            }}
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-200 ease-in-out
              group relative overflow-hidden
              ${currentView === 'profile' 
                ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg transform scale-105' 
                : 'hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300'
              }
            `}
          >
            {/* Background animation */}
            <div className={`
              absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-600 opacity-0
              transition-opacity duration-200
              ${currentView !== 'profile' ? 'group-hover:opacity-10' : ''}
            `} />
            
            <User className={`w-6 h-6 ${currentView === 'profile' ? 'text-white' : 'text-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-400'} transition-colors`} />
            <span className={`
              font-medium text-lg
              ${currentView === 'profile' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
              group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors
            `}>
              My Profile
            </span>
            
            {/* Active indicator */}
            {currentView === 'profile' && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// Mobile Bottom Navigation
export function MobileBottomNav({ currentView, onViewChange }: { currentView: View; onViewChange: (view: View) => void }) {
  const quickNavItems = [
    { id: 'home' as View, label: 'Home', icon: Home },
    { id: 'analytics' as View, label: 'Stats', icon: BarChart3 },
    { id: 'calendar' as View, label: 'Calendar', icon: Calendar },
    { id: 'progress' as View, label: 'Progress', icon: TrendingUp },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-purple-200/50 dark:border-purple-800/50">
      <div className="flex items-center justify-around py-2">
        {quickNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg
                transition-all duration-200
                ${isActive 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
                }
              `}
            >
              <Icon className={`
                w-5 h-5 transition-all duration-200
                ${isActive ? 'scale-110' : ''}
              `} />
              <span className="text-xs font-medium">
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-purple-600 dark:bg-purple-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

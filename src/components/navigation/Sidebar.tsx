import { useState } from 'react';
import { 
  Home, 
  FileText, 
  BarChart3, 
  Calendar, 
  TrendingUp, 
  Award, 
  Database, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Target,
  Zap
} from 'lucide-react';
import { Logo } from '../ui/Logo';

type View = 'home' | 'templates' | 'analytics' | 'calendar' | 'profile' | 'settings' | 'progress' | 'badges' | 'data';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { 
    id: 'home' as View, 
    label: 'Home', 
    icon: Home, 
    color: 'from-violet-500 to-purple-600',
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

export function Sidebar({ currentView, onViewChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={`
      fixed left-0 top-0 h-full z-20 transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-64'}
      bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
      border-r border-purple-200/50 dark:border-purple-800/50
      shadow-xl shadow-purple-500/10
    `}>
      {/* Header */}
      <div className="p-4 border-b border-purple-200/30 dark:border-purple-800/30">
        <div className="flex items-center justify-between">
          {!isCollapsed ? (
            <button 
              onClick={() => onViewChange('home')}
              className="flex items-center gap-3 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg p-2 transition-colors group"
            >
              <Logo size="lg" />
              <span className="font-black text-2xl text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Elevate
              </span>
            </button>
          ) : (
            <button 
              onClick={() => onViewChange('home')}
              className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="Go to Home"
            >
              <Logo size="sm" />
            </button>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-black dark:text-white" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-black dark:text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="p-2 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <div key={item.id} className="relative">
              <button
                onClick={() => onViewChange(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  w-full flex items-center gap-3 px-3 py-3 rounded-xl
                  transition-all duration-200 ease-in-out
                  group relative overflow-hidden
                  ${isActive 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105` 
                    : 'hover:bg-purple-50 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300'
                  }
                `}
              >
                {/* Background animation */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${item.color} opacity-0
                  transition-opacity duration-200
                  ${isHovered && !isActive ? 'opacity-10' : ''}
                `} />
                
                {/* Icon */}
                <div className={`
                  relative z-10 flex items-center justify-center
                  ${isCollapsed ? 'w-full' : ''}
                `}>
                  <Icon className={`
                    w-5 h-5 transition-all duration-200
                    ${isActive ? 'text-white' : 'text-black dark:text-white'}
                    ${isHovered && !isActive ? 'scale-110' : ''}
                  `} />
                </div>
                
                {/* Label */}
                {!isCollapsed && (
                  <div className="relative z-10 flex-1 text-left">
                    <div className={`
                      font-medium text-sm transition-colors duration-200
                      ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                    `}>
                      {item.label}
                    </div>
                    <div className={`
                      text-xs opacity-70 transition-colors duration-200
                      ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}
                    `}>
                      {item.description}
                    </div>
                  </div>
                )}
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                )}
              </button>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && isHovered && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-30">
                  <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-xl">
                    {item.label}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="absolute bottom-4 left-0 right-0 px-2">
        {!isCollapsed && (
          <div className="bg-slate-800/10 rounded-xl p-3 border border-slate-200/30 dark:border-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-slate-800 dark:text-slate-200" />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Daily Goal
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-slate-800 to-teal-500 h-2 rounded-full w-3/4" />
              </div>
              <span className="text-xs text-slate-600 dark:text-slate-400">75%</span>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-slate-800 to-teal-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { ChevronRight } from 'lucide-react'
import { Logo } from '../ui/Logo'

type View = 'home' | 'templates' | 'analytics' | 'calendar' | 'profile' | 'settings' | 'progress' | 'badges' | 'data';

interface BreadcrumbProps {
  currentView: View;
  onNavigate: (view: View) => void;
  customPath?: Array<{ label: string; view?: View }>;
}

const viewLabels: Record<View, string> = {
  home: 'Habit Command Center',
  templates: 'Habit Templates',
  analytics: 'Analytics & Insights',
  calendar: 'Calendar View',
  profile: 'My Profile',
  settings: 'Settings',
  progress: 'Progress Tracking',
  badges: 'Achievements',
  data: 'Data Management'
};

export function Breadcrumb({ currentView, onNavigate, customPath }: BreadcrumbProps) {
  const basePath = [
    { label: 'Elevate', view: 'home' as View, isHome: true }
  ];

  const path = customPath || [
    ...basePath,
    ...(currentView !== 'home' ? [{ label: viewLabels[currentView], view: currentView }] : [])
  ];

  return (
    <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-4 sm:mb-6 overflow-x-auto">
      {path.map((item, index) => {
        const isLast = index === path.length - 1;
        const isClickable = item.view && !isLast;
        
        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            )}
            
            <div className="flex items-center gap-1 whitespace-nowrap">
              {(item as any).isHome && (
                <div className="mr-1 flex-shrink-0">
                  <Logo size="sm" />
                </div>
              )}
              
              {isClickable ? (
                <button
                  onClick={() => item.view && onNavigate(item.view)}
                  className={`transition-colors font-medium hover:underline truncate ${
                    (item as any).isHome 
                      ? 'text-slate-800 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400'
                      : 'text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300'
                  }`}
                >
                  {item.label}
                </button>
              ) : (
                <span className={`
                  truncate
                  ${(item as any).isHome 
                    ? 'text-slate-800 dark:text-slate-200 font-semibold'
                    : isLast 
                      ? 'text-gray-900 dark:text-gray-100 font-semibold' 
                      : 'text-gray-600 dark:text-gray-400'
                  }
                `}>
                  {item.label}
                </span>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </nav>
  );
}

import { useState } from 'react';
import { 
  Plus, 
  FolderPlus, 
  Target, 
  X
} from 'lucide-react';

interface FloatingActionMenuProps {
  onAddCategory: () => void;
  onAddHabit: () => void;
}

const quickActions = [
  {
    id: 'category',
    label: 'Add Category',
    icon: FolderPlus,
    color: 'from-violet-500 to-purple-600',
    description: 'Create new category'
  },
  {
    id: 'habit',
    label: 'Add Habit',
    icon: Target,
    color: 'from-slate-800 to-teal-500',
    description: 'Add new habit'
  }
];

export function FloatingActionMenu({ onAddCategory, onAddHabit }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case 'category':
        onAddCategory();
        break;
      case 'habit':
        onAddHabit();
        break;
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-3 sm:right-6 z-30">
      {/* Action Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-3 mb-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isHovered = hoveredAction === action.id;
            
            return (
              <div
                key={action.id}
                className="flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Enhanced Label */}
                <div className={`
                  bg-white/95 dark:bg-gray-800/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-xl
                  border border-purple-200/50 dark:border-purple-800/50
                  transition-all duration-300
                  ${isHovered ? 'scale-105 shadow-2xl bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20' : ''}
                  relative overflow-hidden
                `}>
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                      <span className="text-lg">{action.icon === FolderPlus ? '📁' : '🎯'}</span>
                      {action.label}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {action.description}
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Action Button */}
                <button
                  onClick={() => handleActionClick(action.id)}
                  onMouseEnter={() => setHoveredAction(action.id)}
                  onMouseLeave={() => setHoveredAction(null)}
                  className={`
                    w-14 h-14 rounded-full shadow-xl relative overflow-hidden
                    bg-gradient-to-r ${action.color}
                    flex items-center justify-center
                    transition-all duration-300 hover:scale-110
                    ${isHovered ? 'shadow-2xl shadow-purple-500/30 rotate-3' : ''}
                    ring-2 ring-white/20 hover:ring-white/40
                    group
                  `}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  {/* Sparkle effects */}
                  <div className="absolute inset-0">
                    <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full animate-pulse opacity-60" />
                    <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-80" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute top-3 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-70" style={{ animationDelay: '1s' }} />
                  </div>
                  
                  <Icon className={`w-6 h-6 text-white transition-all duration-200 relative z-10 ${isHovered ? 'scale-110 rotate-12' : ''}`} />
                  
                  {/* Floating particles */}
                  {isHovered && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-bounce opacity-70" />
                      <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.3s' }} />
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Enhanced Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-full shadow-2xl
          bg-gradient-to-r from-slate-800 to-teal-500
          flex items-center justify-center
          transition-all duration-300 hover:scale-110 hover:shadow-3xl
          ${isOpen ? 'rotate-45 shadow-teal-500/50' : 'rotate-0'}
          group relative overflow-hidden
          ring-4 ring-white/20 hover:ring-white/40
        `}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Sparkle effect */}
        <div className="absolute inset-0">
          <div className="absolute top-2 right-3 w-1 h-1 bg-white rounded-full animate-pulse opacity-60" />
          <div className="absolute bottom-3 left-2 w-1 h-1 bg-white rounded-full animate-pulse opacity-40" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-4 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-80" style={{ animationDelay: '1s' }} />
        </div>
        
        {isOpen ? (
          <X className="w-7 h-7 text-white transition-transform duration-200 relative z-10" />
        ) : (
          <Plus className="w-7 h-7 text-white transition-transform duration-200 relative z-10 group-hover:rotate-90" />
        )}
        
        {/* Enhanced pulse animation when closed */}
        {!isOpen && (
          <>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 animate-ping opacity-20" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 animate-pulse opacity-10" style={{ animationDelay: '1s' }} />
          </>
        )}
        
        {/* Floating particles effect */}
        {!isOpen && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.5s' }} />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce opacity-50" style={{ animationDelay: '1.5s' }} />
          </div>
        )}
      </button>

      {/* Background overlay when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

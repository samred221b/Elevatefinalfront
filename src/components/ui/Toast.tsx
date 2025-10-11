import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
};

const iconStyles = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const Icon = toastIcons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose(id);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`
        max-w-sm w-full shadow-lg rounded-xl border-2 p-4
        ${toastStyles[type]}
        transform transition-all duration-300 ease-in-out
        ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        animate-in slide-in-from-right-full fade-in-0 duration-300
      `}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-6 h-6 ${iconStyles[type]} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          {message && (
            <p className="text-sm opacity-90 mt-1">{message}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="mt-3 h-1 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full ${iconStyles[type].replace('text-', 'bg-')}`}
          style={{
            width: '100%',
            animation: `shrink-${id} ${duration}ms linear forwards`
          }}
        />
      </div>
      
      <style>
        {`
          @keyframes shrink-${id} {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
    </div>
  );
}

// Toast Container Component
export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
}

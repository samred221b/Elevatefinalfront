import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  icon?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  icon
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-red-100 dark:bg-red-900/30',
          iconColor: 'text-red-600 dark:text-red-400',
          confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          titleColor: 'text-red-900 dark:text-red-100'
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
          titleColor: 'text-yellow-900 dark:text-yellow-100'
        };
      case 'info':
        return {
          iconBg: 'bg-blue-100 dark:bg-blue-900/30',
          iconColor: 'text-blue-600 dark:text-blue-400',
          confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
          titleColor: 'text-blue-900 dark:text-blue-100'
        };
      default:
        return {
          iconBg: 'bg-gray-100 dark:bg-gray-900/30',
          iconColor: 'text-gray-600 dark:text-gray-400',
          confirmBg: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
          titleColor: 'text-gray-900 dark:text-gray-100'
        };
    }
  };

  const styles = getTypeStyles();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl transition-all border border-gray-200/50 dark:border-gray-700/50">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>

          {/* Icon */}
          <div className="flex items-center justify-center mb-4">
            <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
              {icon || <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />}
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${styles.titleColor}`}>
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2.5 text-sm font-medium text-white ${styles.confirmBg} rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

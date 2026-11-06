import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { announceToScreenReader } from '../../utils/focusManagement';

/**
 * Accessible Modal Component
 * Implements WCAG 2.1 SC 2.4.3 (Focus Order)
 * Includes focus trapping, focus restoration, and keyboard support
 */

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  /**
   * ID for the modal dialog (for aria-labelledby)
   */
  id?: string;
  /**
   * Additional description ID (for aria-describedby)
   */
  descriptionId?: string;
  /**
   * Prevent closing on overlay click
   */
  preventCloseOnOverlay?: boolean;
  /**
   * Prevent closing on Escape key
   */
  preventCloseOnEscape?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className = '',
  id = 'modal',
  descriptionId,
  preventCloseOnOverlay = false,
  preventCloseOnEscape = false,
}: ModalProps) {
  const modalRef = useFocusTrap(isOpen);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = `${id}-title`;

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Announce modal opening
      announceToScreenReader(`${title} dialog opened`, 'assertive');

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus
      if (previousFocusRef.current && previousFocusRef.current.focus) {
        setTimeout(() => {
          previousFocusRef.current?.focus();
        }, 0);
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, title]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || preventCloseOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        announceToScreenReader(`${title} dialog closed`, 'assertive');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, preventCloseOnEscape, title]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !preventCloseOnOverlay) {
      onClose();
      announceToScreenReader(`${title} dialog closed`, 'assertive');
    }
  };

  // Handle close button click
  const handleClose = () => {
    onClose();
    announceToScreenReader(`${title} dialog closed`, 'assertive');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-slate-800 rounded-lg shadow-2xl transform transition-all ${className}`}
        role="document"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2
            id={titleId}
            className="text-xl font-semibold text-gray-900 dark:text-white"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Close ${title} dialog`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

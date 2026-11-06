import { useEffect, useRef, useCallback } from 'react';
import { focusFirstInContainer, announceToScreenReader } from '../utils/focusManagement';

interface UseFocusManagementOptions {
  /**
   * Focus the container when it mounts
   */
  focusOnMount?: boolean;

  /**
   * Announce to screen readers when content updates
   */
  announceUpdates?: boolean;

  /**
   * Custom announcement message
   */
  announcementMessage?: string;

  /**
   * Restore focus on unmount
   */
  restoreFocusOnUnmount?: boolean;
}

/**
 * Hook for managing focus in dynamically updated content
 * Implements WCAG 2.1 SC 2.4.3
 */
export function useFocusManagement(options: UseFocusManagementOptions = {}) {
  const {
    focusOnMount = false,
    announceUpdates = false,
    announcementMessage,
    restoreFocusOnUnmount = false,
  } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Save previous focus if we need to restore it
    if (restoreFocusOnUnmount) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Focus on mount if requested
    if (focusOnMount && containerRef.current) {
      setTimeout(() => {
        focusFirstInContainer(containerRef.current);
      }, 100);
    }

    return () => {
      // Restore focus on unmount if requested
      if (restoreFocusOnUnmount && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [focusOnMount, restoreFocusOnUnmount]);

  // Function to manually trigger focus
  const focusContainer = useCallback(() => {
    if (containerRef.current) {
      focusFirstInContainer(containerRef.current);
    }
  }, []);

  // Function to announce content updates
  const announceUpdate = useCallback((message?: string) => {
    const announcement = message || announcementMessage || 'Content updated';
    announceToScreenReader(announcement);
  }, [announcementMessage]);

  // Combined update handler
  const handleContentUpdate = useCallback((message?: string) => {
    if (announceUpdates) {
      announceUpdate(message);
    }
    setTimeout(() => {
      focusContainer();
    }, 100);
  }, [announceUpdates, announceUpdate, focusContainer]);

  return {
    containerRef,
    focusContainer,
    announceUpdate,
    handleContentUpdate,
  };
}

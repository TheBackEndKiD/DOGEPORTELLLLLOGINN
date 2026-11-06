import { useEffect, useRef } from 'react';
import { trapFocus, focusManager } from '../utils/focusManagement';

/**
 * Hook to trap focus within a component (for modals/dialogs)
 * Implements WCAG 2.1 SC 2.4.3
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Save current focus before trapping
    focusManager.saveFocus();

    // Set up focus trap
    const cleanup = trapFocus(containerRef.current);

    // Focus first element in container
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Cleanup
    return () => {
      cleanup();
      focusManager.restoreFocus();
    };
  }, [isActive]);

  return containerRef;
}

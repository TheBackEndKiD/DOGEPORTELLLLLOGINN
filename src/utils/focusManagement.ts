/**
 * Focus Management Utilities
 * Implements WCAG 2.1 Success Criterion 2.4.3 (Focus Order)
 * Ensures logical focus order and proper focus restoration
 */

/**
 * Gets all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors))
    .filter(element => {
      // Check if element is visible and not hidden
      return (
        element.offsetWidth > 0 &&
        element.offsetHeight > 0 &&
        window.getComputedStyle(element).visibility !== 'hidden'
      );
    });
}

/**
 * Traps focus within a container (for modals/dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Focus Management Store
 * Stores and restores focus positions
 */
class FocusManager {
  private focusStack: HTMLElement[] = [];

  /**
   * Save current focus to stack
   */
  saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }

  /**
   * Restore focus from stack
   */
  restoreFocus(): void {
    const element = this.focusStack.pop();
    if (element && element.focus) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        element.focus();
      }, 0);
    }
  }

  /**
   * Clear focus stack
   */
  clearStack(): void {
    this.focusStack = [];
  }

  /**
   * Get stack size
   */
  getStackSize(): number {
    return this.focusStack.length;
  }
}

export const focusManager = new FocusManager();

/**
 * Moves focus to an element by ID
 */
export function focusElementById(id: string, options?: { preventScroll?: boolean }): boolean {
  const element = document.getElementById(id);
  if (element) {
    element.focus(options);
    return true;
  }
  return false;
}

/**
 * Moves focus to first heading or focusable element in container
 */
export function focusFirstInContainer(container: HTMLElement | null): boolean {
  if (!container) return false;

  // Try to focus first heading
  const firstHeading = container.querySelector('h1, h2, h3, h4, h5, h6') as HTMLElement;
  if (firstHeading) {
    // Make heading focusable temporarily
    const originalTabIndex = firstHeading.getAttribute('tabindex');
    firstHeading.setAttribute('tabindex', '-1');
    firstHeading.focus();

    // Restore original tabindex after focus
    if (originalTabIndex === null) {
      firstHeading.removeAttribute('tabindex');
    } else {
      firstHeading.setAttribute('tabindex', originalTabIndex);
    }
    return true;
  }

  // Fall back to first focusable element
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
    return true;
  }

  return false;
}

/**
 * Announces content to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Creates a focus trap cleanup function
 */
export function createFocusTrap(container: HTMLElement, options?: {
  initialFocus?: HTMLElement | null;
  returnFocus?: HTMLElement | null;
}): () => void {
  // Save current focus
  const previousFocus = options?.returnFocus || (document.activeElement as HTMLElement);

  // Focus initial element or first focusable
  if (options?.initialFocus) {
    options.initialFocus.focus();
  } else {
    const focusableElements = getFocusableElements(container);
    focusableElements[0]?.focus();
  }

  // Set up focus trap
  const cleanup = trapFocus(container);

  // Return combined cleanup function
  return () => {
    cleanup();
    if (previousFocus && previousFocus.focus) {
      previousFocus.focus();
    }
  };
}

/**
 * Manages focus for route changes
 */
export function handleRouteChange(newPath: string): void {
  // Announce route change to screen readers
  const routeName = newPath.split('/').filter(Boolean).join(' ').replace(/-/g, ' ') || 'home';
  announceToScreenReader(`Navigated to ${routeName} page`);

  // Focus main content area
  setTimeout(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      focusFirstInContainer(mainContent);
    }
  }, 100);
}

/**
 * Handles focus after dynamic content update
 */
export function handleContentUpdate(
  container: HTMLElement | null,
  message?: string
): void {
  if (!container) return;

  // Announce update
  if (message) {
    announceToScreenReader(message);
  }

  // Focus first element in updated content
  setTimeout(() => {
    focusFirstInContainer(container);
  }, 100);
}

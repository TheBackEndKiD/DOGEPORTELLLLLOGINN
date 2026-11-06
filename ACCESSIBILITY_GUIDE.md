# Accessibility Implementation Guide

## Overview
This guide documents the focus management implementation for WCAG 2.1 SC 2.4.3 (Focus Order) compliance.

---

## Components

### 1. Skip Links
**Location:** `src/components/Accessibility/SkipLinks.tsx`

Provides keyboard shortcuts to bypass repetitive navigation (WCAG 2.1 SC 2.4.1).

**Features:**
- Visible only on keyboard focus
- Skips to main content, navigation, and footer
- Smooth scroll to target
- Automatic focus management

**Usage:**
```tsx
import SkipLinks from './components/Accessibility/SkipLinks';

function App() {
  return (
    <>
      <SkipLinks />
      {/* rest of app */}
    </>
  );
}
```

**Custom Links:**
```tsx
<SkipLinks links={[
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#sidebar', label: 'Skip to sidebar' },
  { href: '#search', label: 'Skip to search' }
]} />
```

---

### 2. Accessible Modal
**Location:** `src/components/Accessibility/Modal.tsx`

Fully accessible modal dialog with focus trap and restoration.

**Features:**
- Focus trapping within modal
- Focus restoration on close
- Escape key to close
- Overlay click to close (optional)
- Screen reader announcements
- Proper ARIA attributes

**Usage:**
```tsx
import Modal from './components/Accessibility/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="My Modal"
        size="md"
      >
        <p>Modal content goes here</p>
        <button onClick={() => setIsOpen(false)}>
          Close
        </button>
      </Modal>
    </>
  );
}
```

**Props:**
- `isOpen` (boolean): Whether modal is visible
- `onClose` (function): Close handler
- `title` (string): Modal title (used for ARIA)
- `size` ('sm' | 'md' | 'lg' | 'xl'): Modal size
- `preventCloseOnOverlay` (boolean): Prevent closing on overlay click
- `preventCloseOnEscape` (boolean): Prevent closing with Escape key
- `id` (string): Modal ID for ARIA
- `descriptionId` (string): ID for additional description

---

### 3. Focusable Section
**Location:** `src/components/Accessibility/FocusableSection.tsx`

Wraps content that needs focus management when updated.

**Features:**
- Automatic focus on mount (optional)
- Screen reader announcements (optional)
- Focus management for dynamic content
- Proper heading hierarchy

**Usage:**
```tsx
import FocusableSection from './components/Accessibility/FocusableSection';

function Dashboard() {
  return (
    <FocusableSection
      id="dashboard-stats"
      title="Dashboard Statistics"
      headingLevel={2}
      focusOnMount={true}
      announceUpdates={true}
      announcementMessage="Dashboard statistics updated"
    >
      {/* Dashboard content */}
    </FocusableSection>
  );
}
```

**Props:**
- `id` (string): Unique section ID
- `title` (string): Section title
- `headingLevel` (1-6): Heading level for title
- `focusOnMount` (boolean): Focus section on mount
- `announceUpdates` (boolean): Announce to screen readers
- `announcementMessage` (string): Custom announcement
- `role` (string): ARIA role (default: 'region')
- `ariaLabel` (string): ARIA label

---

## Hooks

### 1. useFocusTrap
**Location:** `src/hooks/useFocusTrap.ts`

Traps focus within a container (for modals/dialogs).

**Usage:**
```tsx
import { useFocusTrap } from '../hooks/useFocusTrap';

function MyDialog({ isOpen }) {
  const dialogRef = useFocusTrap(isOpen);

  return (
    <div ref={dialogRef} role="dialog">
      {/* Dialog content */}
    </div>
  );
}
```

---

### 2. useFocusManagement
**Location:** `src/hooks/useFocusManagement.ts`

Manages focus for dynamically updated content.

**Usage:**
```tsx
import { useFocusManagement } from '../hooks/useFocusManagement';

function DataTable({ data }) {
  const { containerRef, handleContentUpdate } = useFocusManagement({
    focusOnMount: true,
    announceUpdates: true,
  });

  useEffect(() => {
    handleContentUpdate('Table data updated');
  }, [data]);

  return (
    <div ref={containerRef}>
      {/* Table content */}
    </div>
  );
}
```

**Options:**
- `focusOnMount` (boolean): Focus container on mount
- `announceUpdates` (boolean): Announce updates to screen readers
- `announcementMessage` (string): Default announcement message
- `restoreFocusOnUnmount` (boolean): Restore focus on unmount

**Returns:**
- `containerRef`: Ref to attach to container
- `focusContainer()`: Manually focus container
- `announceUpdate(message)`: Manually announce update
- `handleContentUpdate(message)`: Combined update handler

---

## Utilities

### Focus Management Utilities
**Location:** `src/utils/focusManagement.ts`

#### getFocusableElements(container)
Returns all focusable elements within a container.

```tsx
import { getFocusableElements } from '../utils/focusManagement';

const focusable = getFocusableElements(document.getElementById('my-form'));
console.log(focusable); // [input, button, a, ...]
```

#### trapFocus(container)
Sets up focus trapping within a container. Returns cleanup function.

```tsx
import { trapFocus } from '../utils/focusManagement';

const cleanup = trapFocus(dialogElement);
// Later...
cleanup(); // Remove focus trap
```

#### focusManager
Global focus stack manager for saving/restoring focus.

```tsx
import { focusManager } from '../utils/focusManagement';

// Save current focus
focusManager.saveFocus();

// Do something that changes focus
openModal();

// Restore previous focus
focusManager.restoreFocus();
```

#### focusElementById(id, options)
Focuses an element by ID.

```tsx
import { focusElementById } from '../utils/focusManagement';

focusElementById('main-content');
focusElementById('sidebar', { preventScroll: true });
```

#### focusFirstInContainer(container)
Focuses the first heading or focusable element in a container.

```tsx
import { focusFirstInContainer } from '../utils/focusManagement';

const section = document.getElementById('results');
focusFirstInContainer(section);
```

#### announceToScreenReader(message, priority)
Announces a message to screen readers.

```tsx
import { announceToScreenReader } from '../utils/focusManagement';

announceToScreenReader('Search results loaded');
announceToScreenReader('Error occurred', 'assertive');
```

#### handleRouteChange(newPath)
Manages focus when route changes.

```tsx
import { handleRouteChange } from '../utils/focusManagement';

// In route change handler
handleRouteChange('/dashboard');
```

#### handleContentUpdate(container, message)
Handles focus after dynamic content update.

```tsx
import { handleContentUpdate } from '../utils/focusManagement';

// After loading new data
handleContentUpdate(tableContainer, 'Table updated with new data');
```

---

## Implementation Checklist

### ✅ Skip Links
- [x] Implemented skip links component
- [x] Added to App.tsx
- [x] Keyboard accessible
- [x] Visible on focus

### ✅ Focus Management
- [x] Focus trap for modals
- [x] Focus restoration after modal close
- [x] Route change announcements
- [x] Dynamic content focus management

### ✅ Accessibility Features
- [x] Proper ARIA attributes
- [x] Semantic HTML structure
- [x] Screen reader announcements
- [x] Keyboard navigation support

### ✅ WCAG 2.1 Compliance
- [x] SC 2.4.1 (Bypass Blocks) - Skip links
- [x] SC 2.4.3 (Focus Order) - Logical focus order
- [x] SC 2.4.7 (Focus Visible) - Focus indicators
- [x] SC 4.1.2 (Name, Role, Value) - ARIA attributes

---

## Testing Guide

### Keyboard Navigation Testing
1. **Tab Key**: Navigate through all interactive elements
2. **Shift+Tab**: Navigate backwards
3. **Enter/Space**: Activate buttons and links
4. **Escape**: Close modals and dialogs

### Screen Reader Testing
Test with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

**What to verify:**
- Skip links are announced
- Route changes are announced
- Modal open/close is announced
- Dynamic content updates are announced
- All interactive elements have labels

### Focus Management Testing
1. Open a modal - focus should move into modal
2. Tab through modal - focus should stay trapped
3. Close modal - focus should return to trigger button
4. Change routes - focus should move to main content
5. Update dynamic content - appropriate announcement

### Visual Testing
1. **Focus Indicators**: All focusable elements show visible focus
2. **Skip Links**: Visible when focused, hidden otherwise
3. **High Contrast**: Components work in high contrast mode

---

## Common Patterns

### Pattern 1: Form with Focus Management
```tsx
import { useFocusManagement } from '../hooks/useFocusManagement';

function MyForm() {
  const { containerRef, handleContentUpdate } = useFocusManagement();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form...
    setSubmitted(true);
    handleContentUpdate('Form submitted successfully');
  };

  return (
    <form ref={containerRef} onSubmit={handleSubmit}>
      {submitted && (
        <div role="alert" className="success-message">
          Form submitted successfully!
        </div>
      )}
      {/* Form fields */}
    </form>
  );
}
```

### Pattern 2: Data Table with Updates
```tsx
import { useFocusManagement } from '../hooks/useFocusManagement';

function DataTable({ data, loading }) {
  const { containerRef, announceUpdate } = useFocusManagement({
    announceUpdates: true
  });

  useEffect(() => {
    if (!loading && data) {
      announceUpdate(`Table loaded with ${data.length} rows`);
    }
  }, [loading, data]);

  return (
    <div ref={containerRef}>
      {loading ? <p>Loading...</p> : <table>{/* table rows */}</table>}
    </div>
  );
}
```

### Pattern 3: Modal Dialog
```tsx
import Modal from '../components/Accessibility/Modal';

function DeleteConfirmation({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
      size="sm"
    >
      <p id="delete-description">
        Are you sure you want to delete "{itemName}"? This action cannot be undone.
      </p>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
}
```

---

## Best Practices

### 1. Always Provide Skip Links
Every page should have skip links to main content areas.

### 2. Restore Focus After Interruptions
When closing modals or completing actions, restore focus to the triggering element.

### 3. Announce Dynamic Changes
When content updates dynamically, announce changes to screen readers.

### 4. Maintain Logical Focus Order
Ensure tab order follows visual and logical order.

### 5. Use Semantic HTML
Use proper HTML elements (button, nav, main, etc.) for better accessibility.

### 6. Test with Keyboard Only
Always test your application using only the keyboard.

### 7. Provide Focus Indicators
Ensure all focusable elements have visible focus indicators.

---

## Browser Support

All focus management features work in:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

Graceful degradation for older browsers.

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Focus Management](https://webaim.org/techniques/keyboard/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

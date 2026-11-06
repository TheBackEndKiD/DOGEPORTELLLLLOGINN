import React, { useEffect } from 'react';
import { useFocusManagement } from '../../hooks/useFocusManagement';

/**
 * Focusable Section Component
 * Wraps content that needs focus management when updated
 * Implements WCAG 2.1 SC 2.4.3
 */

interface FocusableSectionProps {
  children: React.ReactNode;
  /**
   * Unique ID for the section
   */
  id: string;
  /**
   * Section heading level
   */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Section title
   */
  title?: string;
  /**
   * Focus on mount
   */
  focusOnMount?: boolean;
  /**
   * Announce updates to screen readers
   */
  announceUpdates?: boolean;
  /**
   * Custom announcement message
   */
  announcementMessage?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * ARIA role
   */
  role?: string;
  /**
   * ARIA label
   */
  ariaLabel?: string;
}

export default function FocusableSection({
  children,
  id,
  headingLevel = 2,
  title,
  focusOnMount = false,
  announceUpdates = false,
  announcementMessage,
  className = '',
  role = 'region',
  ariaLabel,
}: FocusableSectionProps) {
  const { containerRef, handleContentUpdate } = useFocusManagement({
    focusOnMount,
    announceUpdates,
    announcementMessage,
  });

  // Create heading tag
  const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;

  return (
    <section
      ref={containerRef}
      id={id}
      className={className}
      role={role}
      aria-label={ariaLabel || title}
      tabIndex={-1}
    >
      {title && (
        <HeadingTag className="text-2xl font-bold mb-4 focus:outline-none">
          {title}
        </HeadingTag>
      )}
      {children}
    </section>
  );
}

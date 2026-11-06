import React from 'react';

/**
 * Skip Links Component
 * Implements WCAG 2.1 SC 2.4.1 (Bypass Blocks)
 * Provides keyboard shortcuts to skip to main content areas
 */

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' },
];

export default function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  const handleSkipClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();

    const target = document.querySelector(targetId) as HTMLElement;
    if (target) {
      // Make target focusable if it's not already
      const originalTabIndex = target.getAttribute('tabindex');
      if (!originalTabIndex) {
        target.setAttribute('tabindex', '-1');
      }

      // Focus the target
      target.focus();

      // Scroll into view
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Remove tabindex if we added it
      if (!originalTabIndex) {
        target.addEventListener('blur', () => {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    }
  };

  return (
    <div className="skip-links">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="skip-link"
          onClick={(e) => handleSkipClick(e, link.href)}
        >
          {link.label}
        </a>
      ))}
      <style jsx>{`
        .skip-links {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }

        .skip-link {
          position: absolute;
          top: -100px;
          left: 0;
          padding: 12px 24px;
          background-color: #1e293b;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          border-radius: 0 0 8px 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
          transition: top 0.3s ease;
          white-space: nowrap;
        }

        .skip-link:focus {
          top: 0;
          outline: 3px solid #3b82f6;
          outline-offset: 2px;
        }

        .skip-link:hover {
          background-color: #334155;
        }

        .skip-link:active {
          background-color: #475569;
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .skip-link {
            border: 2px solid #ffffff;
          }
        }

        /* Ensure visibility in all scenarios */
        .skip-link:focus-visible {
          top: 0;
        }
      `}</style>
    </div>
  );
}

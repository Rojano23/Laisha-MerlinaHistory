/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Robust scroll-to-top helper for mobile, tablet, and desktop devices.
 * Handles quirks across iOS Safari, Android Chrome, and responsive layouts
 * where browser scroll restoration or asynchronous reflows might leave the user
 * halfway down or at the bottom of the section.
 */
export function scrollToPageTop(smooth = false): void {
  if (typeof window === 'undefined') return;

  // 1. Configure history scroll restoration to manual if supported
  if ('scrollRestoration' in window.history) {
    try {
      window.history.scrollRestoration = 'manual';
    } catch {
      // ignore
    }
  }

  const performScroll = () => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: smooth ? 'smooth' : 'instant',
      });
    } catch {
      window.scrollTo(0, 0);
    }

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Also reset any scrollable main container
    const mainContainer = document.getElementById('main-content-view');
    if (mainContainer) {
      mainContainer.scrollTop = 0;
    }
  };

  // Immediate execution
  performScroll();

  // Next animation frame (after React commit and layout calculation)
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(() => {
      performScroll();
    });
  }

  // Backup timeout for mobile browsers where layout may reflow
  setTimeout(() => {
    performScroll();
  }, 40);
}

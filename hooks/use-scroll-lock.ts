import { useEffect } from 'react';

/**
 * Locks body scroll while a modal is open.
 *
 * `overflow: hidden` alone is not enough: it collapses the scrollbar, which
 * shifts the page horizontally, and on iOS Safari the background still scrolls.
 * Pinning the body with `position: fixed` and restoring scrollY on close fixes
 * both, and padding compensates for the lost scrollbar width.
 *
 * Nested/stacked modals are reference-counted so the inner one closing does not
 * release the lock the outer one still needs.
 */
let lockCount = 0;
let savedScrollY = 0;

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      savedScrollY = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount === 0) {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, savedScrollY);
      }
    };
  }, [active]);
}

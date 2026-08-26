'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIconSmall } from './icons';

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Mirror whatever theme-script.tsx already applied before hydration —
  // read the DOM class rather than localStorage so this can't disagree
  // with what the user is actually looking at. Same documented exception
  // as cart-context.tsx / auth-context.tsx: a one-time sync from an
  // external source on mount, not state derived from props/other state.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch {
      // Storage blocked — theme still applies for this page view.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex size-9 items-center justify-center rounded-lg text-ink-soft hover:bg-surface-hover"
    >
      {isDark ? <SunIconSmall className="size-5" /> : <MoonIcon className="size-5" />}
    </button>
  );
}

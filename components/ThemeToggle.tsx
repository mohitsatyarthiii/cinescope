'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      <Sun className="w-4 h-4 text-gray-600 dark:text-gray-300 transition-all duration-200 group-hover:scale-110 dark:rotate-90 dark:scale-0" />
      <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300 absolute transition-all duration-200 group-hover:scale-110 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </button>
  );
}
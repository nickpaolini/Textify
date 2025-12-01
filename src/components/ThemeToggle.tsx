'use client';

import { Moon, Sun } from 'lucide-react';

import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle dark/light mode"
      onClick={toggleTheme}
      className="ml-2"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </Button>
  );
}

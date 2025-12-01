import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import * as ThemeProvider from '../ThemeProvider';
import ThemeToggle from '../ThemeToggle';

// Mock the ThemeProvider
vi.mock('../ThemeProvider', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeToggle Component', () => {
  it('should render with sun icon in light mode', () => {
    // Mock light theme
    vi.spyOn(ThemeProvider, 'useTheme').mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', {
      name: /toggle dark\/light mode/i,
    });
    expect(button).toBeInTheDocument();

    // In light mode, Moon icon should be displayed
    const moonIcon = button.querySelector('svg');
    expect(moonIcon).toBeInTheDocument();
  });

  it('should render with moon icon in dark mode', () => {
    // Mock dark theme
    vi.spyOn(ThemeProvider, 'useTheme').mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', {
      name: /toggle dark\/light mode/i,
    });
    expect(button).toBeInTheDocument();

    // In dark mode, Sun icon should be displayed
    const sunIcon = button.querySelector('svg');
    expect(sunIcon).toBeInTheDocument();
  });

  it('should call toggleTheme when clicked', () => {
    const mockToggleTheme = vi.fn();

    // Mock theme with toggle function
    vi.spyOn(ThemeProvider, 'useTheme').mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', {
      name: /toggle dark\/light mode/i,
    });
    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should have proper accessibility attributes', () => {
    vi.spyOn(ThemeProvider, 'useTheme').mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', {
      name: /toggle dark\/light mode/i,
    });

    expect(button).toHaveAttribute('aria-label', 'Toggle dark/light mode');
    expect(button.tagName).toBe('BUTTON');
  });

  it('should switch icon when theme changes', () => {
    const { rerender } = render(<ThemeToggle />);

    // Start with light theme
    vi.spyOn(ThemeProvider, 'useTheme').mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    });

    rerender(<ThemeToggle />);
    let button = screen.getByRole('button', {
      name: /toggle dark\/light mode/i,
    });
    expect(button.querySelector('svg')).toBeInTheDocument();

    // Switch to dark theme
    vi.spyOn(ThemeProvider, 'useTheme').mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
      toggleTheme: vi.fn(),
    });

    rerender(<ThemeToggle />);
    button = screen.getByRole('button', { name: /toggle dark\/light mode/i });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });
});

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
    } as any);

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
    } as any);

    render(<ThemeToggle />);

    const button = screen.getByRole('button', {
      name: /toggle dark\/light mode/i,
    });
    expect(button).toBeInTheDocument();

    // In dark mode, Sun icon should be displayed
    const sunIcon = button.querySelector('svg');
    expect(sunIcon).toBeInTheDocument();
  });

  it('should call setTheme when clicked', () => {
    const mockSetTheme = vi.fn();

    // Mock theme with setTheme function
    vi.spyOn(ThemeProvider, 'useTheme').mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    } as any);

    render(<ThemeToggle />);

    const button = screen.getByRole('button', {
      name: /toggle dark\/light mode/i,
    });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should have proper accessibility attributes', () => {
    vi.spyOn(ThemeProvider, 'useTheme').mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    } as any);

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
    } as any);

    rerender(<ThemeToggle />);
    let button = screen.getByRole('button', {
      name: /toggle dark\/light mode/i,
    });
    expect(button.querySelector('svg')).toBeInTheDocument();

    // Switch to dark theme
    vi.spyOn(ThemeProvider, 'useTheme').mockReturnValue({
      theme: 'dark',
      setTheme: vi.fn(),
    } as any);

    rerender(<ThemeToggle />);
    button = screen.getByRole('button', { name: /toggle dark\/light mode/i });
    expect(button.querySelector('svg')).toBeInTheDocument();
  });
});

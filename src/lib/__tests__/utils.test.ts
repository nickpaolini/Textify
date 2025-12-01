import { describe, it, expect } from 'vitest';

import { cn } from '../utils';

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toBe('text-red-500 bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class active-class');
  });

  it('should handle false conditional classes', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toBe('base-class');
  });

  it('should merge conflicting Tailwind classes correctly', () => {
    // tailwind-merge should keep the last conflicting class
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['text-sm', 'font-bold'], 'text-red-500');
    expect(result).toBe('text-sm font-bold text-red-500');
  });

  it('should handle objects with conditional classes', () => {
    const result = cn({
      'text-red-500': true,
      'bg-blue-500': false,
      'font-bold': true,
    });
    expect(result).toBe('text-red-500 font-bold');
  });

  it('should filter out undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'another-class');
    expect(result).toBe('base-class another-class');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle complex nested conditions', () => {
    const isPrimary = true;
    const isLarge = true;
    const disabled = false;

    const result = cn(
      'base-button',
      {
        'bg-blue-500': isPrimary,
        'bg-gray-500': !isPrimary,
      },
      {
        'text-sm': !isLarge,
        'text-lg': isLarge,
      },
      disabled && 'opacity-50'
    );

    expect(result).toContain('base-button');
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('text-lg');
    expect(result).not.toContain('opacity-50');
  });
});

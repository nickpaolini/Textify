import { describe, expect, it } from 'vitest';

import {
  dedentLines,
  ensureTrailingNewline,
  indentLines,
  normalizeLineEndings,
  normalizeWhitespace,
  removeAllWhitespace,
  removeEmptyLines,
  removeExtraSpaces,
  removeTrailingNewline,
  spacesToTabs,
  tabsToSpaces,
  toCRLF,
  toLF,
  trimEnd,
  trimLines,
  trimStart,
  trimText,
  wrapText,
} from '../whitespace';

describe('Whitespace Management', () => {
  describe('trimText', () => {
    it('trims whitespace from both ends', () => {
      expect(trimText('  hello  ')).toBe('hello');
    });
  });

  describe('trimStart', () => {
    it('trims whitespace from start', () => {
      expect(trimStart('  hello  ')).toBe('hello  ');
    });
  });

  describe('trimEnd', () => {
    it('trims whitespace from end', () => {
      expect(trimEnd('  hello  ')).toBe('  hello');
    });
  });

  describe('removeAllWhitespace', () => {
    it('removes all whitespace', () => {
      expect(removeAllWhitespace('hello world\ntest')).toBe('helloworldtest');
    });
  });

  describe('normalizeWhitespace', () => {
    it('normalizes multiple spaces to single space', () => {
      expect(normalizeWhitespace('hello    world')).toBe('hello world');
    });

    it('trims and normalizes', () => {
      expect(normalizeWhitespace('  hello    world  ')).toBe('hello world');
    });
  });

  describe('removeExtraSpaces', () => {
    it('removes extra spaces but preserves line breaks', () => {
      expect(removeExtraSpaces('hello    world\ntest    line')).toBe(
        'hello world\ntest line'
      );
    });
  });

  describe('removeEmptyLines', () => {
    it('removes empty lines', () => {
      expect(removeEmptyLines('line1\n\nline2\n\nline3')).toBe(
        'line1\nline2\nline3'
      );
    });
  });

  describe('trimLines', () => {
    it('trims each line', () => {
      expect(trimLines('  line1  \n  line2  ')).toBe('line1\nline2');
    });
  });

  describe('indentLines', () => {
    it('adds indentation to each line', () => {
      expect(indentLines('line1\nline2', 2)).toBe('  line1\n  line2');
    });
  });

  describe('dedentLines', () => {
    it('removes common indentation', () => {
      expect(dedentLines('  line1\n  line2')).toBe('line1\nline2');
    });

    it('preserves relative indentation', () => {
      expect(dedentLines('  line1\n    line2')).toBe('line1\n  line2');
    });
  });

  describe('tabsToSpaces', () => {
    it('converts tabs to spaces', () => {
      expect(tabsToSpaces('\thello', 4)).toBe('    hello');
    });
  });

  describe('spacesToTabs', () => {
    it('converts spaces to tabs', () => {
      expect(spacesToTabs('    hello', 4)).toBe('\thello');
    });
  });

  describe('normalizeLineEndings', () => {
    it('normalizes line endings to LF', () => {
      expect(normalizeLineEndings('line1\r\nline2\rline3')).toBe(
        'line1\nline2\nline3'
      );
    });
  });

  describe('toCRLF', () => {
    it('converts to CRLF', () => {
      expect(toCRLF('line1\nline2')).toBe('line1\r\nline2');
    });
  });

  describe('toLF', () => {
    it('converts to LF', () => {
      expect(toLF('line1\r\nline2')).toBe('line1\nline2');
    });
  });

  describe('ensureTrailingNewline', () => {
    it('adds trailing newline if missing', () => {
      expect(ensureTrailingNewline('hello')).toBe('hello\n');
    });

    it('does not add if already present', () => {
      expect(ensureTrailingNewline('hello\n')).toBe('hello\n');
    });
  });

  describe('removeTrailingNewline', () => {
    it('removes trailing newline', () => {
      expect(removeTrailingNewline('hello\n')).toBe('hello');
    });
  });

  describe('wrapText', () => {
    it('wraps text to specified length', () => {
      const text = 'The quick brown fox jumps over the lazy dog';
      const wrapped = wrapText(text, 20);
      const lines = wrapped.split('\n');

      expect(lines.every((line) => line.length <= 20)).toBe(true);
    });
  });
});

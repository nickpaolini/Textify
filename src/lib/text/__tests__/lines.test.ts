import { describe, expect, it } from 'vitest';

import {
  addLineNumbers,
  addLinePrefix,
  addLineSuffix,
  deduplicateLines,
  deleteLines,
  extractLines,
  filterLinesContaining,
  joinLines,
  removeLineNumbers,
  reverseLines,
  sortLines,
  sortLinesAlphabetically,
  sortLinesByLength,
  sortLinesNumerically,
  splitIntoLines,
  wrapLines,
} from '../lines';

describe('Line Operations', () => {
  describe('sortLinesAlphabetically', () => {
    it('sorts lines alphabetically ascending', () => {
      expect(sortLinesAlphabetically('zebra\napple\nbanana')).toBe(
        'apple\nbanana\nzebra'
      );
    });

    it('sorts lines alphabetically descending', () => {
      expect(sortLinesAlphabetically('zebra\napple\nbanana', 'desc')).toBe(
        'zebra\nbanana\napple'
      );
    });

    it('handles case-insensitive sorting', () => {
      expect(
        sortLinesAlphabetically('Zebra\napple\nBanana', 'asc', false)
      ).toBe('apple\nBanana\nZebra');
    });
  });

  describe('sortLinesNumerically', () => {
    it('sorts lines numerically', () => {
      expect(sortLinesNumerically('10\n2\n100\n20')).toBe('2\n10\n20\n100');
    });

    it('sorts lines numerically descending', () => {
      expect(sortLinesNumerically('10\n2\n100\n20', 'desc')).toBe(
        '100\n20\n10\n2'
      );
    });
  });

  describe('sortLinesByLength', () => {
    it('sorts lines by length ascending', () => {
      expect(sortLinesByLength('aaa\na\naa')).toBe('a\naa\naaa');
    });

    it('sorts lines by length descending', () => {
      expect(sortLinesByLength('aaa\na\naa', 'desc')).toBe('aaa\naa\na');
    });
  });

  describe('sortLines', () => {
    it('sorts alphabetically by default', () => {
      expect(sortLines('c\nb\na')).toBe('a\nb\nc');
    });

    it('sorts numerically', () => {
      expect(sortLines('10\n2\n100', 'numerical')).toBe('2\n10\n100');
    });

    it('sorts by length', () => {
      expect(sortLines('aaa\na\naa', 'length')).toBe('a\naa\naaa');
    });
  });

  describe('deduplicateLines', () => {
    it('removes duplicate lines', () => {
      expect(deduplicateLines('line1\nline2\nline1\nline3')).toBe(
        'line1\nline2\nline3'
      );
    });

    it('handles case-insensitive deduplication', () => {
      expect(deduplicateLines('Line1\nline1\nLine2', false)).toBe(
        'Line1\nLine2'
      );
    });
  });

  describe('reverseLines', () => {
    it('reverses line order', () => {
      expect(reverseLines('line1\nline2\nline3')).toBe('line3\nline2\nline1');
    });
  });

  describe('filterLinesContaining', () => {
    it('filters lines containing string', () => {
      expect(filterLinesContaining('hello\nworld\nhello world', 'hello')).toBe(
        'hello\nhello world'
      );
    });

    it('filters lines not containing string with invert', () => {
      expect(
        filterLinesContaining('hello\nworld\nhello world', 'hello', false, true)
      ).toBe('world');
    });
  });

  describe('addLineNumbers', () => {
    it('adds line numbers', () => {
      expect(addLineNumbers('line1\nline2')).toBe('1. line1\n2. line2');
    });

    it('starts at custom number', () => {
      expect(addLineNumbers('line1\nline2', 10)).toBe('10. line1\n11. line2');
    });
  });

  describe('removeLineNumbers', () => {
    it('removes line numbers', () => {
      expect(removeLineNumbers('1. line1\n2. line2')).toBe('line1\nline2');
    });
  });

  describe('addLinePrefix', () => {
    it('adds prefix to each line', () => {
      expect(addLinePrefix('line1\nline2', '> ')).toBe('> line1\n> line2');
    });
  });

  describe('addLineSuffix', () => {
    it('adds suffix to each line', () => {
      expect(addLineSuffix('line1\nline2', ';')).toBe('line1;\nline2;');
    });
  });

  describe('wrapLines', () => {
    it('wraps lines with prefix and suffix', () => {
      expect(wrapLines('line1\nline2', '"', '"')).toBe('"line1"\n"line2"');
    });
  });

  describe('extractLines', () => {
    it('extracts lines by range', () => {
      expect(extractLines('line1\nline2\nline3\nline4', 2, 3)).toBe(
        'line2\nline3'
      );
    });
  });

  describe('deleteLines', () => {
    it('deletes lines by range', () => {
      expect(deleteLines('line1\nline2\nline3\nline4', 2, 3)).toBe(
        'line1\nline4'
      );
    });
  });

  describe('joinLines', () => {
    it('joins lines with default separator', () => {
      expect(joinLines('line1\nline2\nline3')).toBe('line1 line2 line3');
    });

    it('joins lines with custom separator', () => {
      expect(joinLines('line1\nline2\nline3', ', ')).toBe(
        'line1, line2, line3'
      );
    });
  });

  describe('splitIntoLines', () => {
    it('splits by delimiter', () => {
      expect(splitIntoLines('one,two,three', ',')).toBe('one\ntwo\nthree');
    });
  });
});

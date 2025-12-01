import { describe, expect, it } from 'vitest';

import {
  countCharacters,
  countLines,
  countParagraphs,
  countSentences,
  countWords,
  estimateReadingTime,
  getAllCounts,
  getReadingTimeString,
} from '../counting';

describe('Text Counting', () => {
  describe('countCharacters', () => {
    it('counts characters with spaces', () => {
      expect(countCharacters('hello world', true)).toBe(11);
    });

    it('counts characters without spaces', () => {
      expect(countCharacters('hello world', false)).toBe(10);
    });

    it('returns 0 for empty string', () => {
      expect(countCharacters('', true)).toBe(0);
    });
  });

  describe('countWords', () => {
    it('counts words correctly', () => {
      expect(countWords('hello world')).toBe(2);
      expect(countWords('one two three four')).toBe(4);
    });

    it('handles contractions', () => {
      expect(countWords("don't you think it's great")).toBe(5);
    });

    it('returns 0 for empty string', () => {
      expect(countWords('')).toBe(0);
    });

    it('handles multiple spaces', () => {
      expect(countWords('hello    world')).toBe(2);
    });
  });

  describe('countLines', () => {
    it('counts lines including empty', () => {
      expect(countLines('line1\nline2\nline3', true)).toBe(3);
    });

    it('counts lines excluding empty', () => {
      expect(countLines('line1\n\nline2', false)).toBe(2);
    });

    it('returns 0 for empty string', () => {
      expect(countLines('', true)).toBe(0);
    });
  });

  describe('countSentences', () => {
    it('counts sentences ending with period', () => {
      expect(countSentences('Hello. World. Test.')).toBe(3);
    });

    it('counts sentences with different punctuation', () => {
      expect(countSentences('Hello! How are you? Fine.')).toBe(3);
    });

    it('returns 0 for empty string', () => {
      expect(countSentences('')).toBe(0);
    });
  });

  describe('countParagraphs', () => {
    it('counts paragraphs', () => {
      expect(countParagraphs('Para 1\n\nPara 2\n\nPara 3')).toBe(3);
    });

    it('ignores multiple blank lines', () => {
      expect(countParagraphs('Para 1\n\n\nPara 2')).toBe(2);
    });

    it('returns 0 for empty string', () => {
      expect(countParagraphs('')).toBe(0);
    });
  });

  describe('getAllCounts', () => {
    it('returns all counts', () => {
      const text = 'Hello world. This is a test.\n\nSecond paragraph.';
      const counts = getAllCounts(text);

      expect(counts.characters).toBeGreaterThan(0);
      expect(counts.words).toBe(8);
      expect(counts.sentences).toBe(3);
    });
  });

  describe('estimateReadingTime', () => {
    it('estimates reading time', () => {
      const text = 'word '.repeat(200); // 200 words
      expect(estimateReadingTime(text, 200)).toBe(1);
    });

    it('rounds up', () => {
      const text = 'word '.repeat(250); // 250 words
      expect(estimateReadingTime(text, 200)).toBe(2);
    });
  });

  describe('getReadingTimeString', () => {
    it('returns formatted string for very short text', () => {
      expect(getReadingTimeString('hello')).toBe('< 1 min read');
    });

    it('returns formatted string for short text', () => {
      expect(getReadingTimeString('hello world')).toBe('< 1 min read');
    });

    it('returns formatted string for longer text', () => {
      const text = 'word '.repeat(400);
      expect(getReadingTimeString(text, 200)).toBe('2 min read');
    });

    it('returns formatted string for exactly 1 minute', () => {
      const text = 'word '.repeat(200); // Exactly 200 words
      expect(getReadingTimeString(text, 200)).toBe('1 min read');
    });
  });
});

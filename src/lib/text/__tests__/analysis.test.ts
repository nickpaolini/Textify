import { describe, expect, it } from 'vitest';

import {
  calculateReadabilityScore,
  countOccurrences,
  extractEmails,
  extractHashtags,
  extractMentions,
  extractURLs,
  findAllPositions,
  getCharacterFrequency,
  getReadabilityLevel,
  getTextStatistics,
  getWordFrequency,
} from '../analysis';

describe('Text Analysis', () => {
  describe('getCharacterFrequency', () => {
    it('counts character frequency', () => {
      const freq = getCharacterFrequency('hello', true);
      expect(freq.find((f) => f.character === 'l')?.count).toBe(2);
      expect(freq.find((f) => f.character === 'h')?.count).toBe(1);
    });

    it('sorts by count descending', () => {
      const freq = getCharacterFrequency('aaaaabbc');
      expect(freq[0].character).toBe('a');
      expect(freq[0].count).toBe(5);
    });

    it('limits results', () => {
      const freq = getCharacterFrequency('abcdefgh', true, 3);
      expect(freq.length).toBe(3);
    });
  });

  describe('getWordFrequency', () => {
    it('counts word frequency', () => {
      const freq = getWordFrequency('the cat and the dog', false, 10);
      expect(freq.find((f) => f.word === 'the')?.count).toBe(2);
    });

    it('sorts by count descending', () => {
      const freq = getWordFrequency('a a a b b c');
      expect(freq[0].word).toBe('a');
      expect(freq[0].count).toBe(3);
    });
  });

  describe('getTextStatistics', () => {
    it('returns comprehensive statistics', () => {
      const text = 'Hello world. This is a test.';
      const stats = getTextStatistics(text);

      expect(stats.words).toBe(6);
      expect(stats.sentences).toBe(2);
      expect(stats.characters).toBeGreaterThan(0);
      expect(stats.averageWordLength).toBeGreaterThan(0);
    });
  });

  describe('calculateReadabilityScore', () => {
    it('calculates readability score', () => {
      const text = 'The cat sat on the mat. It was a big cat.';
      const score = calculateReadabilityScore(text);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('getReadabilityLevel', () => {
    it('returns level for high scores', () => {
      expect(getReadabilityLevel(95)).toContain('Very Easy');
    });

    it('returns level for low scores', () => {
      expect(getReadabilityLevel(20)).toContain('Very Difficult');
    });
  });

  describe('extractURLs', () => {
    it('extracts URLs', () => {
      const text = 'Visit https://example.com and http://test.org';
      const urls = extractURLs(text);
      expect(urls).toContain('https://example.com');
      expect(urls).toContain('http://test.org');
    });
  });

  describe('extractEmails', () => {
    it('extracts email addresses', () => {
      const text = 'Contact us at test@example.com or admin@test.org';
      const emails = extractEmails(text);
      expect(emails).toContain('test@example.com');
      expect(emails).toContain('admin@test.org');
    });
  });

  describe('extractHashtags', () => {
    it('extracts hashtags', () => {
      const text = 'This is #awesome and #cool';
      const hashtags = extractHashtags(text);
      expect(hashtags).toContain('#awesome');
      expect(hashtags).toContain('#cool');
    });
  });

  describe('extractMentions', () => {
    it('extracts mentions', () => {
      const text = 'Hello @john and @jane';
      const mentions = extractMentions(text);
      expect(mentions).toContain('@john');
      expect(mentions).toContain('@jane');
    });
  });

  describe('countOccurrences', () => {
    it('counts occurrences case-sensitive', () => {
      expect(countOccurrences('Hello hello HELLO', 'hello', true)).toBe(1);
    });

    it('counts occurrences case-insensitive', () => {
      expect(countOccurrences('Hello hello HELLO', 'hello', false)).toBe(3);
    });
  });

  describe('findAllPositions', () => {
    it('finds all positions', () => {
      const positions = findAllPositions('hello hello world', 'hello');
      expect(positions).toEqual([0, 6]);
    });

    it('returns empty array when not found', () => {
      const positions = findAllPositions('hello world', 'test');
      expect(positions).toEqual([]);
    });
  });
});

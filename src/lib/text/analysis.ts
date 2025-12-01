/**
 * Text Analysis Utilities
 *
 * Functions for analyzing text and extracting statistics
 */

export interface CharacterFrequency {
  character: string;
  count: number;
  percentage: number;
}

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface TextStatistics {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  averageWordLength: number;
  averageSentenceLength: number;
  longestWord: string;
  shortestWord: string;
  uniqueWords: number;
  readingTime: string;
}

/**
 * Get character frequency
 *
 * @param text - The text to analyze
 * @param caseSensitive - Whether to treat characters case-sensitively
 * @param limit - Maximum number of results (default: all)
 * @returns Array of character frequencies sorted by count (descending)
 */
export function getCharacterFrequency(
  text: string,
  caseSensitive = false,
  limit?: number
): CharacterFrequency[] {
  const processedText = caseSensitive ? text : text.toLowerCase();
  const charMap = new Map<string, number>();

  for (const char of processedText) {
    if (char === ' ' || char === '\n' || char === '\t') continue;
    charMap.set(char, (charMap.get(char) || 0) + 1);
  }

  const total = Array.from(charMap.values()).reduce(
    (sum, count) => sum + count,
    0
  );
  const frequencies: CharacterFrequency[] = Array.from(charMap.entries())
    .map(([character, count]) => ({
      character,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  return limit ? frequencies.slice(0, limit) : frequencies;
}

/**
 * Get word frequency
 *
 * @param text - The text to analyze
 * @param caseSensitive - Whether to treat words case-sensitively
 * @param limit - Maximum number of results (default: 10)
 * @returns Array of word frequencies sorted by count (descending)
 */
export function getWordFrequency(
  text: string,
  caseSensitive = false,
  limit = 10
): WordFrequency[] {
  const processedText = caseSensitive ? text : text.toLowerCase();
  const words = processedText.match(/\b[\w'-]+\b/g) || [];
  const wordMap = new Map<string, number>();

  for (const word of words) {
    wordMap.set(word, (wordMap.get(word) || 0) + 1);
  }

  const total = words.length;
  const frequencies: WordFrequency[] = Array.from(wordMap.entries())
    .map(([word, count]) => ({
      word,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count);

  return limit ? frequencies.slice(0, limit) : frequencies;
}

/**
 * Get comprehensive text statistics
 *
 * @param text - The text to analyze
 * @returns Object containing various text statistics
 */
export function getTextStatistics(text: string): TextStatistics {
  // Character counts
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Word analysis
  const words = text.match(/\b[\w'-]+\b/g) || [];
  const wordCount = words.length;
  const uniqueWords = new Set(words.map((w) => w.toLowerCase())).size;

  // Line and sentence counts
  const lines = text.split('\n').length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;

  // Average calculations
  const totalWordLength = words.reduce((sum, word) => sum + word.length, 0);
  const averageWordLength = wordCount > 0 ? totalWordLength / wordCount : 0;
  const averageSentenceLength = sentences > 0 ? wordCount / sentences : 0;

  // Longest and shortest words
  const sortedWords = words.sort((a, b) => b.length - a.length);
  const longestWord = sortedWords[0] || '';
  const shortestWord = sortedWords[sortedWords.length - 1] || '';

  // Reading time
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  const readingTime =
    readingTimeMinutes < 1 ? '< 1 min' : `${readingTimeMinutes} min`;

  return {
    characters,
    charactersNoSpaces,
    words: wordCount,
    lines,
    sentences,
    paragraphs,
    averageWordLength: Math.round(averageWordLength * 10) / 10,
    averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
    longestWord,
    shortestWord,
    uniqueWords,
    readingTime,
  };
}

/**
 * Calculate readability score (Flesch Reading Ease)
 *
 * @param text - The text to analyze
 * @returns Readability score (0-100, higher is easier to read)
 */
export function calculateReadabilityScore(text: string): number {
  const words = (text.match(/\b[\w'-]+\b/g) || []).length;
  const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
  const syllables = countSyllables(text);

  if (words === 0 || sentences === 0) return 0;

  const score =
    206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

/**
 * Count syllables in text (approximate)
 *
 * @param text - The text to analyze
 * @returns Approximate syllable count
 */
function countSyllables(text: string): number {
  const words = text.match(/\b[\w'-]+\b/g) || [];
  let syllableCount = 0;

  for (const word of words) {
    syllableCount += countSyllablesInWord(word);
  }

  return syllableCount;
}

/**
 * Count syllables in a single word (approximate)
 *
 * @param word - The word to analyze
 * @returns Approximate syllable count
 */
function countSyllablesInWord(word: string): number {
  word = word.toLowerCase();
  if (word.length <= 3) return 1;

  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;

  // Adjust for silent 'e'
  if (word.endsWith('e')) count--;

  // Ensure at least 1 syllable
  return Math.max(1, count);
}

/**
 * Get readability level description
 *
 * @param score - Flesch Reading Ease score
 * @returns Description of readability level
 */
export function getReadabilityLevel(score: number): string {
  if (score >= 90) return 'Very Easy (5th grade)';
  if (score >= 80) return 'Easy (6th grade)';
  if (score >= 70) return 'Fairly Easy (7th grade)';
  if (score >= 60) return 'Standard (8th-9th grade)';
  if (score >= 50) return 'Fairly Difficult (10th-12th grade)';
  if (score >= 30) return 'Difficult (College)';
  return 'Very Difficult (College graduate)';
}

/**
 * Extract all URLs from text
 *
 * @param text - The text to analyze
 * @returns Array of URLs found in the text
 */
export function extractURLs(text: string): string[] {
  const urlRegex = /https?:\/\/[^\s)]+/g;
  return text.match(urlRegex) || [];
}

/**
 * Extract all email addresses from text
 *
 * @param text - The text to analyze
 * @returns Array of email addresses found in the text
 */
export function extractEmails(text: string): string[] {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  return text.match(emailRegex) || [];
}

/**
 * Extract all hashtags from text
 *
 * @param text - The text to analyze
 * @returns Array of hashtags found in the text
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g;
  return text.match(hashtagRegex) || [];
}

/**
 * Extract all mentions from text (@username)
 *
 * @param text - The text to analyze
 * @returns Array of mentions found in the text
 */
export function extractMentions(text: string): string[] {
  const mentionRegex = /@[\w]+/g;
  return text.match(mentionRegex) || [];
}

/**
 * Count occurrences of a substring
 *
 * @param text - The text to search
 * @param substring - The substring to count
 * @param caseSensitive - Whether to search case-sensitively
 * @returns Number of occurrences
 */
export function countOccurrences(
  text: string,
  substring: string,
  caseSensitive = false
): number {
  if (!substring) return 0;

  const searchText = caseSensitive ? text : text.toLowerCase();
  const searchSubstring = caseSensitive ? substring : substring.toLowerCase();

  let count = 0;
  let position = 0;

  while ((position = searchText.indexOf(searchSubstring, position)) !== -1) {
    count++;
    position += searchSubstring.length;
  }

  return count;
}

/**
 * Find all positions of a substring
 *
 * @param text - The text to search
 * @param substring - The substring to find
 * @param caseSensitive - Whether to search case-sensitively
 * @returns Array of starting positions
 */
export function findAllPositions(
  text: string,
  substring: string,
  caseSensitive = false
): number[] {
  if (!substring) return [];

  const searchText = caseSensitive ? text : text.toLowerCase();
  const searchSubstring = caseSensitive ? substring : substring.toLowerCase();

  const positions: number[] = [];
  let position = 0;

  while ((position = searchText.indexOf(searchSubstring, position)) !== -1) {
    positions.push(position);
    position += searchSubstring.length;
  }

  return positions;
}

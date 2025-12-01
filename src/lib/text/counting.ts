/**
 * Text Counting Utilities
 *
 * Functions for counting various text metrics
 */

export interface TextCounts {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  sentences: number;
  paragraphs: number;
}

/**
 * Count characters in text
 *
 * @param text - The text to count
 * @param includeSpaces - Whether to include spaces in the count
 * @returns The number of characters
 */
export function countCharacters(text: string, includeSpaces = true): number {
  if (!text) return 0;
  return includeSpaces ? text.length : text.replace(/\s/g, '').length;
}

/**
 * Count words in text
 *
 * @param text - The text to count
 * @returns The number of words
 */
export function countWords(text: string): number {
  if (!text) return 0;
  // Match sequences of word characters (letters, numbers, underscores)
  // and handle contractions like "don't", "it's"
  const words = text.match(/\b[\w'-]+\b/g);
  return words ? words.length : 0;
}

/**
 * Count lines in text
 *
 * @param text - The text to count
 * @param countEmpty - Whether to count empty lines
 * @returns The number of lines
 */
export function countLines(text: string, countEmpty = true): number {
  if (!text) return 0;
  const lines = text.split('\n');
  if (countEmpty) {
    return lines.length;
  }
  return lines.filter((line) => line.trim().length > 0).length;
}

/**
 * Count sentences in text
 *
 * @param text - The text to count
 * @returns The number of sentences
 */
export function countSentences(text: string): number {
  if (!text) return 0;
  // Match sentences ending with ., !, or ?
  // Handle abbreviations like "Mr.", "Dr.", "etc."
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  return sentences ? sentences.length : 0;
}

/**
 * Count paragraphs in text
 *
 * @param text - The text to count
 * @returns The number of paragraphs
 */
export function countParagraphs(text: string): number {
  if (!text) return 0;
  // Split by one or more blank lines
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.filter((p) => p.trim().length > 0).length;
}

/**
 * Get all text counts at once
 *
 * @param text - The text to analyze
 * @returns An object containing all text counts
 */
export function getAllCounts(text: string): TextCounts {
  return {
    characters: countCharacters(text, true),
    charactersNoSpaces: countCharacters(text, false),
    words: countWords(text),
    lines: countLines(text, true),
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
  };
}

/**
 * Estimate reading time in minutes
 *
 * @param text - The text to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
export function estimateReadingTime(
  text: string,
  wordsPerMinute = 200
): number {
  const words = countWords(text);
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get reading time as a formatted string
 *
 * @param text - The text to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Formatted reading time (e.g., "5 min read", "< 1 min read")
 */
export function getReadingTimeString(
  text: string,
  wordsPerMinute = 200
): string {
  const words = countWords(text);
  const exactMinutes = words / wordsPerMinute;

  if (exactMinutes < 1) return '< 1 min read';

  const minutes = Math.ceil(exactMinutes);
  return `${minutes} min read`;
}

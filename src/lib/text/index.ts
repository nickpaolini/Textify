/**
 * Text Processing Library
 *
 * A comprehensive text processing library for Textify
 */

// Export all counting functions
export {
  countCharacters,
  countWords,
  countLines,
  countSentences,
  countParagraphs,
  getAllCounts,
  estimateReadingTime,
  getReadingTimeString,
  type TextCounts,
} from './counting';

// Export all case conversion functions
export {
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toSentenceCase,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toDotCase,
  invertCase,
  toAlternatingCase,
  capitalizeWords,
  capitalizeFirst,
} from './case';

// Export all whitespace management functions
export {
  trimText,
  trimStart,
  trimEnd,
  removeAllWhitespace,
  normalizeWhitespace,
  removeExtraSpaces,
  removeEmptyLines,
  trimLines,
  indentLines,
  dedentLines,
  tabsToSpaces,
  spacesToTabs,
  normalizeLineEndings,
  toCRLF,
  toLF,
  ensureTrailingNewline,
  removeTrailingNewline,
  wrapText,
} from './whitespace';

// Export all line operation functions
export {
  sortLines,
  sortLinesAlphabetically,
  sortLinesNumerically,
  sortLinesByLength,
  deduplicateLines,
  reverseLines,
  shuffleLines,
  filterLines,
  filterLinesContaining,
  filterLinesMatching,
  addLineNumbers,
  removeLineNumbers,
  addLinePrefix,
  addLineSuffix,
  wrapLines,
  extractLines,
  deleteLines,
  joinLines,
  splitIntoLines,
  type SortOrder,
  type SortType,
} from './lines';

// Export all analysis functions
export {
  getCharacterFrequency,
  getWordFrequency,
  getTextStatistics,
  calculateReadabilityScore,
  getReadabilityLevel,
  extractURLs,
  extractEmails,
  extractHashtags,
  extractMentions,
  countOccurrences,
  findAllPositions,
  type CharacterFrequency,
  type WordFrequency,
  type TextStatistics,
} from './analysis';

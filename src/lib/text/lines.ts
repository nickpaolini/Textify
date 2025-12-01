/**
 * Line Operation Utilities
 *
 * Functions for manipulating lines of text
 */

export type SortOrder = 'asc' | 'desc';
export type SortType = 'alphabetical' | 'numerical' | 'length';

/**
 * Sort lines alphabetically
 *
 * @param text - The text to sort
 * @param order - Sort order ('asc' or 'desc')
 * @param caseSensitive - Whether to sort case-sensitively
 * @returns The text with sorted lines
 */
export function sortLinesAlphabetically(
  text: string,
  order: SortOrder = 'asc',
  caseSensitive = false
): string {
  const lines = text.split('\n');
  lines.sort((a, b) => {
    const aVal = caseSensitive ? a : a.toLowerCase();
    const bVal = caseSensitive ? b : b.toLowerCase();

    if (order === 'asc') {
      return aVal.localeCompare(bVal);
    }
    return bVal.localeCompare(aVal);
  });
  return lines.join('\n');
}

/**
 * Sort lines numerically (by the first number found in each line)
 *
 * @param text - The text to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns The text with sorted lines
 */
export function sortLinesNumerically(
  text: string,
  order: SortOrder = 'asc'
): string {
  const lines = text.split('\n');
  lines.sort((a, b) => {
    const aMatch = a.match(/-?\d+\.?\d*/);
    const bMatch = b.match(/-?\d+\.?\d*/);
    const aNum = aMatch ? parseFloat(aMatch[0]) : 0;
    const bNum = bMatch ? parseFloat(bMatch[0]) : 0;

    if (order === 'asc') {
      return aNum - bNum;
    }
    return bNum - aNum;
  });
  return lines.join('\n');
}

/**
 * Sort lines by length
 *
 * @param text - The text to sort
 * @param order - Sort order ('asc' or 'desc')
 * @returns The text with sorted lines
 */
export function sortLinesByLength(
  text: string,
  order: SortOrder = 'asc'
): string {
  const lines = text.split('\n');
  lines.sort((a, b) => {
    if (order === 'asc') {
      return a.length - b.length;
    }
    return b.length - a.length;
  });
  return lines.join('\n');
}

/**
 * Sort lines (generic)
 *
 * @param text - The text to sort
 * @param type - Sort type ('alphabetical', 'numerical', 'length')
 * @param order - Sort order ('asc' or 'desc')
 * @param caseSensitive - Whether to sort case-sensitively (for alphabetical sort)
 * @returns The text with sorted lines
 */
export function sortLines(
  text: string,
  type: SortType = 'alphabetical',
  order: SortOrder = 'asc',
  caseSensitive = false
): string {
  switch (type) {
    case 'numerical':
      return sortLinesNumerically(text, order);
    case 'length':
      return sortLinesByLength(text, order);
    case 'alphabetical':
    default:
      return sortLinesAlphabetically(text, order, caseSensitive);
  }
}

/**
 * Remove duplicate lines
 *
 * @param text - The text to process
 * @param caseSensitive - Whether to treat lines case-sensitively
 * @param keepFirst - Whether to keep the first occurrence (true) or last (false)
 * @returns The text with duplicate lines removed
 */
export function deduplicateLines(
  text: string,
  caseSensitive = true,
  keepFirst = true
): string {
  const lines = text.split('\n');
  const seen = new Set<string>();
  const result: string[] = [];

  const processLines = keepFirst ? lines : lines.reverse();

  for (const line of processLines) {
    const key = caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }

  return (keepFirst ? result : result.reverse()).join('\n');
}

/**
 * Reverse the order of lines
 *
 * @param text - The text to reverse
 * @returns The text with reversed lines
 */
export function reverseLines(text: string): string {
  return text.split('\n').reverse().join('\n');
}

/**
 * Shuffle lines randomly
 *
 * @param text - The text to shuffle
 * @returns The text with shuffled lines
 */
export function shuffleLines(text: string): string {
  const lines = text.split('\n');
  // Fisher-Yates shuffle algorithm
  for (let i = lines.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lines[i], lines[j]] = [lines[j], lines[i]];
  }
  return lines.join('\n');
}

/**
 * Filter lines by a predicate function
 *
 * @param text - The text to filter
 * @param predicate - Function that returns true for lines to keep
 * @returns The filtered text
 */
export function filterLines(
  text: string,
  predicate: (line: string, index: number) => boolean
): string {
  return text.split('\n').filter(predicate).join('\n');
}

/**
 * Filter lines containing a string
 *
 * @param text - The text to filter
 * @param searchString - String to search for
 * @param caseSensitive - Whether to search case-sensitively
 * @param invert - If true, keep lines NOT containing the string
 * @returns The filtered text
 */
export function filterLinesContaining(
  text: string,
  searchString: string,
  caseSensitive = false,
  invert = false
): string {
  return filterLines(text, (line) => {
    const lineToSearch = caseSensitive ? line : line.toLowerCase();
    const stringToFind = caseSensitive
      ? searchString
      : searchString.toLowerCase();
    const contains = lineToSearch.includes(stringToFind);
    return invert ? !contains : contains;
  });
}

/**
 * Filter lines matching a regex pattern
 *
 * @param text - The text to filter
 * @param pattern - Regex pattern to match
 * @param invert - If true, keep lines NOT matching the pattern
 * @returns The filtered text
 */
export function filterLinesMatching(
  text: string,
  pattern: RegExp,
  invert = false
): string {
  return filterLines(text, (line) => {
    const matches = pattern.test(line);
    return invert ? !matches : matches;
  });
}

/**
 * Add line numbers to text
 *
 * @param text - The text to number
 * @param startAt - Starting line number (default: 1)
 * @param separator - Separator between number and line (default: '. ')
 * @returns The text with line numbers
 */
export function addLineNumbers(
  text: string,
  startAt = 1,
  separator = '. '
): string {
  return text
    .split('\n')
    .map((line, index) => `${startAt + index}${separator}${line}`)
    .join('\n');
}

/**
 * Remove line numbers from text
 *
 * @param text - The text to process
 * @returns The text without line numbers
 */
export function removeLineNumbers(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/^\d+\.?\s*/, ''))
    .join('\n');
}

/**
 * Add prefix to each line
 *
 * @param text - The text to process
 * @param prefix - Prefix to add
 * @returns The text with prefixes added
 */
export function addLinePrefix(text: string, prefix: string): string {
  return text
    .split('\n')
    .map((line) => prefix + line)
    .join('\n');
}

/**
 * Add suffix to each line
 *
 * @param text - The text to process
 * @param suffix - Suffix to add
 * @returns The text with suffixes added
 */
export function addLineSuffix(text: string, suffix: string): string {
  return text
    .split('\n')
    .map((line) => line + suffix)
    .join('\n');
}

/**
 * Wrap each line with prefix and suffix
 *
 * @param text - The text to process
 * @param prefix - Prefix to add
 * @param suffix - Suffix to add
 * @returns The text with each line wrapped
 */
export function wrapLines(
  text: string,
  prefix: string,
  suffix: string
): string {
  return text
    .split('\n')
    .map((line) => prefix + line + suffix)
    .join('\n');
}

/**
 * Extract lines by range
 *
 * @param text - The text to process
 * @param start - Starting line number (1-indexed)
 * @param end - Ending line number (1-indexed, inclusive)
 * @returns The extracted lines
 */
export function extractLines(text: string, start: number, end: number): string {
  const lines = text.split('\n');
  return lines.slice(start - 1, end).join('\n');
}

/**
 * Delete lines by range
 *
 * @param text - The text to process
 * @param start - Starting line number (1-indexed)
 * @param end - Ending line number (1-indexed, inclusive)
 * @returns The text with lines deleted
 */
export function deleteLines(text: string, start: number, end: number): string {
  const lines = text.split('\n');
  lines.splice(start - 1, end - start + 1);
  return lines.join('\n');
}

/**
 * Join lines into a single line
 *
 * @param text - The text to join
 * @param separator - Separator to use (default: ' ')
 * @returns The joined text
 */
export function joinLines(text: string, separator = ' '): string {
  return text.split('\n').join(separator);
}

/**
 * Split text into lines by a delimiter
 *
 * @param text - The text to split
 * @param delimiter - Delimiter to split on
 * @returns The text split into lines
 */
export function splitIntoLines(text: string, delimiter: string): string {
  return text.split(delimiter).join('\n');
}

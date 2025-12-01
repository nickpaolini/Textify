/**
 * Case Conversion Utilities
 *
 * Functions for converting text between different cases
 */

/**
 * Convert text to UPPERCASE
 *
 * @param text - The text to convert
 * @returns The text in uppercase
 */
export function toUpperCase(text: string): string {
  return text.toUpperCase();
}

/**
 * Convert text to lowercase
 *
 * @param text - The text to convert
 * @returns The text in lowercase
 */
export function toLowerCase(text: string): string {
  return text.toLowerCase();
}

/**
 * Convert text to Title Case
 *
 * @param text - The text to convert
 * @returns The text in title case
 */
export function toTitleCase(text: string): string {
  // List of words that should not be capitalized (unless first/last word)
  const minorWords = new Set([
    'a',
    'an',
    'the',
    'and',
    'but',
    'or',
    'for',
    'nor',
    'as',
    'at',
    'by',
    'for',
    'from',
    'in',
    'into',
    'of',
    'on',
    'onto',
    'to',
    'with',
  ]);

  return text
    .toLowerCase()
    .split(/\s+/)
    .map((word, index, array) => {
      // Always capitalize first and last word
      if (index === 0 || index === array.length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Don't capitalize minor words
      if (minorWords.has(word)) {
        return word;
      }
      // Capitalize other words
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Convert text to Sentence case
 *
 * @param text - The text to convert
 * @returns The text in sentence case
 */
export function toSentenceCase(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Convert text to camelCase
 *
 * @param text - The text to convert
 * @returns The text in camelCase
 */
export function toCamelCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Convert text to PascalCase
 *
 * @param text - The text to convert
 * @returns The text in PascalCase
 */
export function toPascalCase(text: string): string {
  return text
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[a-z]/, (char) => char.toUpperCase());
}

/**
 * Convert text to snake_case
 *
 * @param text - The text to convert
 * @returns The text in snake_case
 */
export function toSnakeCase(text: string): string {
  return text
    .replace(/([A-Z])/g, '_$1')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

/**
 * Convert text to kebab-case
 *
 * @param text - The text to convert
 * @returns The text in kebab-case
 */
export function toKebabCase(text: string): string {
  return text
    .replace(/([A-Z])/g, '-$1')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Convert text to CONSTANT_CASE
 *
 * @param text - The text to convert
 * @returns The text in CONSTANT_CASE
 */
export function toConstantCase(text: string): string {
  return toSnakeCase(text).toUpperCase();
}

/**
 * Convert text to dot.case
 *
 * @param text - The text to convert
 * @returns The text in dot.case
 */
export function toDotCase(text: string): string {
  return text
    .replace(/([A-Z])/g, '.$1')
    .replace(/[^a-zA-Z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
    .toLowerCase();
}

/**
 * Invert the case of each character
 *
 * @param text - The text to convert
 * @returns The text with inverted case
 */
export function invertCase(text: string): string {
  return text
    .split('')
    .map((char) => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      }
      return char.toUpperCase();
    })
    .join('');
}

/**
 * Convert text to aLtErNaTiNg CaSe
 *
 * @param text - The text to convert
 * @param startWithUpper - Whether to start with uppercase (default: false)
 * @returns The text in alternating case
 */
export function toAlternatingCase(
  text: string,
  startWithUpper = false
): string {
  let isUpper = startWithUpper;
  return text
    .split('')
    .map((char) => {
      if (!/[a-zA-Z]/.test(char)) {
        return char;
      }
      const result = isUpper ? char.toUpperCase() : char.toLowerCase();
      isUpper = !isUpper;
      return result;
    })
    .join('');
}

/**
 * Capitalize the first letter of each word
 *
 * @param text - The text to convert
 * @returns The text with each word capitalized
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Capitalize only the first letter of the text
 *
 * @param text - The text to convert
 * @returns The text with first letter capitalized
 */
export function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

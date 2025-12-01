/**
 * Whitespace Management Utilities
 *
 * Functions for managing whitespace in text
 */

/**
 * Trim whitespace from the start and end of text
 *
 * @param text - The text to trim
 * @returns The trimmed text
 */
export function trimText(text: string): string {
  return text.trim();
}

/**
 * Trim whitespace from the start of text
 *
 * @param text - The text to trim
 * @returns The trimmed text
 */
export function trimStart(text: string): string {
  return text.trimStart();
}

/**
 * Trim whitespace from the end of text
 *
 * @param text - The text to trim
 * @returns The trimmed text
 */
export function trimEnd(text: string): string {
  return text.trimEnd();
}

/**
 * Remove all whitespace from text
 *
 * @param text - The text to process
 * @returns The text without any whitespace
 */
export function removeAllWhitespace(text: string): string {
  return text.replace(/\s/g, '');
}

/**
 * Normalize whitespace (replace multiple spaces with single space)
 *
 * @param text - The text to normalize
 * @returns The text with normalized whitespace
 */
export function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Remove extra spaces (multiple spaces to single space, but preserve line breaks)
 *
 * @param text - The text to process
 * @returns The text with extra spaces removed
 */
export function removeExtraSpaces(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .join('\n');
}

/**
 * Remove empty lines
 *
 * @param text - The text to process
 * @returns The text without empty lines
 */
export function removeEmptyLines(text: string): string {
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .join('\n');
}

/**
 * Trim each line
 *
 * @param text - The text to process
 * @returns The text with each line trimmed
 */
export function trimLines(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n');
}

/**
 * Add indentation to each line
 *
 * @param text - The text to indent
 * @param spaces - Number of spaces to indent (default: 2)
 * @returns The indented text
 */
export function indentLines(text: string, spaces = 2): string {
  const indent = ' '.repeat(spaces);
  return text
    .split('\n')
    .map((line) => indent + line)
    .join('\n');
}

/**
 * Remove indentation from each line
 *
 * @param text - The text to dedent
 * @returns The dedented text
 */
export function dedentLines(text: string): string {
  const lines = text.split('\n');

  // Find minimum indentation (excluding empty lines)
  const minIndent = lines
    .filter((line) => line.trim().length > 0)
    .reduce((min, line) => {
      const match = line.match(/^(\s*)/);
      const indent = match ? match[1].length : 0;
      return Math.min(min, indent);
    }, Infinity);

  if (minIndent === Infinity || minIndent === 0) {
    return text;
  }

  // Remove the minimum indentation from each line
  return lines.map((line) => line.slice(minIndent)).join('\n');
}

/**
 * Convert tabs to spaces
 *
 * @param text - The text to convert
 * @param tabSize - Number of spaces per tab (default: 4)
 * @returns The text with tabs converted to spaces
 */
export function tabsToSpaces(text: string, tabSize = 4): string {
  const spaces = ' '.repeat(tabSize);
  return text.replace(/\t/g, spaces);
}

/**
 * Convert spaces to tabs
 *
 * @param text - The text to convert
 * @param tabSize - Number of spaces per tab (default: 4)
 * @returns The text with spaces converted to tabs
 */
export function spacesToTabs(text: string, tabSize = 4): string {
  const spacesRegex = new RegExp(` {${tabSize}}`, 'g');
  return text.replace(spacesRegex, '\t');
}

/**
 * Normalize line endings to LF (\n)
 *
 * @param text - The text to normalize
 * @returns The text with LF line endings
 */
export function normalizeLineEndings(text: string): string {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

/**
 * Convert line endings to CRLF (\r\n)
 *
 * @param text - The text to convert
 * @returns The text with CRLF line endings
 */
export function toCRLF(text: string): string {
  return normalizeLineEndings(text).replace(/\n/g, '\r\n');
}

/**
 * Convert line endings to LF (\n)
 *
 * @param text - The text to convert
 * @returns The text with LF line endings
 */
export function toLF(text: string): string {
  return normalizeLineEndings(text);
}

/**
 * Ensure text ends with a newline
 *
 * @param text - The text to process
 * @returns The text with a trailing newline
 */
export function ensureTrailingNewline(text: string): string {
  return text.endsWith('\n') ? text : `${text}\n`;
}

/**
 * Remove trailing newline if present
 *
 * @param text - The text to process
 * @returns The text without a trailing newline
 */
export function removeTrailingNewline(text: string): string {
  return text.replace(/\n$/, '');
}

/**
 * Wrap text to a specific line length
 *
 * @param text - The text to wrap
 * @param maxLength - Maximum line length (default: 80)
 * @returns The wrapped text
 */
export function wrapText(text: string, maxLength = 80): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join('\n');
}

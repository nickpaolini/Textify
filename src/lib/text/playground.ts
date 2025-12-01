/**
 * Text Processing Playground
 *
 * Quick script to test and explore text processing functions
 * Run with: npx tsx src/lib/text/playground.ts
 */

/* eslint-disable no-console */

import {
  // Counting
  countWords,
  getAllCounts,
  getReadingTimeString,

  // Case conversion
  toCamelCase,
  toSnakeCase,
  toTitleCase,
  toKebabCase,

  // Whitespace
  normalizeWhitespace,
  trimLines,

  // Line operations
  sortLines,
  deduplicateLines,
  reverseLines,
  addLineNumbers,

  // Analysis
  getTextStatistics,
  getWordFrequency,
  extractURLs,
  extractEmails,
} from './index';

console.log('🎨 Text Processing Playground\n');

// ===== COUNTING EXAMPLES =====
console.log('📊 COUNTING');
console.log('─'.repeat(50));

const sampleText = `Hello world! This is a test.
This text spans multiple lines.
Let's see what we can learn from it.`;

console.log('Sample text:');
console.log(sampleText);
console.log();

const counts = getAllCounts(sampleText);
console.log('Counts:', counts);
console.log('Reading time:', getReadingTimeString(sampleText));
console.log();

// ===== CASE CONVERSION EXAMPLES =====
console.log('🔤 CASE CONVERSION');
console.log('─'.repeat(50));

const phrase = 'hello world example';
console.log('Original:', phrase);
console.log('camelCase:', toCamelCase(phrase));
console.log('snake_case:', toSnakeCase(phrase));
console.log('kebab-case:', toKebabCase(phrase));
console.log('Title Case:', toTitleCase(phrase));
console.log();

// ===== WHITESPACE EXAMPLES =====
console.log('⚪ WHITESPACE MANAGEMENT');
console.log('─'.repeat(50));

const messyText = '  hello    world  \n  multiple   spaces  ';
console.log('Messy:', JSON.stringify(messyText));
console.log('Normalized:', normalizeWhitespace(messyText));
console.log('Lines trimmed:', trimLines(messyText));
console.log();

// ===== LINE OPERATIONS EXAMPLES =====
console.log('📝 LINE OPERATIONS');
console.log('─'.repeat(50));

const lines = `zebra
apple
banana
apple
zebra`;

console.log('Original lines:');
console.log(lines);
console.log();

console.log('Sorted:');
console.log(sortLines(lines));
console.log();

console.log('Deduplicated:');
console.log(deduplicateLines(lines));
console.log();

console.log('Reversed:');
console.log(reverseLines(lines));
console.log();

console.log('With line numbers:');
console.log(addLineNumbers(lines));
console.log();

// ===== ANALYSIS EXAMPLES =====
console.log('🔍 TEXT ANALYSIS');
console.log('─'.repeat(50));

const analysisText = `The cat sat on the mat. The cat was happy.
Visit us at https://example.com or email test@example.com
Follow @johndoe and check out #awesome`;

console.log('Analysis text:');
console.log(analysisText);
console.log();

const stats = getTextStatistics(analysisText);
console.log('Statistics:');
console.log(`- Words: ${stats.words}`);
console.log(`- Unique words: ${stats.uniqueWords}`);
console.log(`- Avg word length: ${stats.averageWordLength}`);
console.log(`- Sentences: ${stats.sentences}`);
console.log();

const topWords = getWordFrequency(analysisText, false, 5);
console.log('Top 5 words:');
topWords.forEach((w, i) => {
  console.log(
    `  ${i + 1}. "${w.word}" - ${w.count} times (${w.percentage.toFixed(1)}%)`
  );
});
console.log();

const urls = extractURLs(analysisText);
console.log('URLs found:', urls);

const emails = extractEmails(analysisText);
console.log('Emails found:', emails);
console.log();

// ===== TRY YOUR OWN =====
console.log('✨ TRY YOUR OWN');
console.log('─'.repeat(50));
console.log('Edit this file to test your own text transformations!');
console.log('Add your experiments below:\n');

// Your experiments here:
const myText = 'Your text here...';
console.log('My text:', myText);
console.log('Word count:', countWords(myText));

'use client';

import { useState } from 'react';

import {
  getAllCounts,
  getTextStatistics,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  toTitleCase,
  sortLines,
  deduplicateLines,
} from '@/lib/text';

export default function TextDemoPage() {
  const [input, setInput] = useState(
    "Hello World!\nThis is a test.\nLet's see what happens."
  );

  const counts = getAllCounts(input);
  const stats = getTextStatistics(input);

  return (
    <div className="container mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Text Processing Demo</h1>

      <div className="mb-6">
        <label className="mb-2 block font-semibold">Input Text:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-32 w-full rounded border p-3 font-mono"
          placeholder="Enter text to process..."
        />
      </div>

      <div className="space-y-6">
        {/* Counts */}
        <section className="rounded-lg border p-4">
          <h2 className="mb-3 text-xl font-semibold">📊 Counts</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <div>
              <div className="text-sm text-gray-600">Words</div>
              <div className="text-2xl font-bold">{counts.words}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Characters</div>
              <div className="text-2xl font-bold">{counts.characters}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Lines</div>
              <div className="text-2xl font-bold">{counts.lines}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Sentences</div>
              <div className="text-2xl font-bold">{counts.sentences}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Paragraphs</div>
              <div className="text-2xl font-bold">{counts.paragraphs}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Reading Time</div>
              <div className="text-2xl font-bold">{stats.readingTime}</div>
            </div>
          </div>
        </section>

        {/* Case Conversions */}
        <section className="rounded-lg border p-4">
          <h2 className="mb-3 text-xl font-semibold">🔤 Case Conversions</h2>
          <div className="space-y-2 font-mono text-sm">
            <div>
              <span className="text-gray-600">Title Case:</span>{' '}
              {toTitleCase(input)}
            </div>
            <div>
              <span className="text-gray-600">camelCase:</span>{' '}
              {toCamelCase(input)}
            </div>
            <div>
              <span className="text-gray-600">snake_case:</span>{' '}
              {toSnakeCase(input)}
            </div>
            <div>
              <span className="text-gray-600">kebab-case:</span>{' '}
              {toKebabCase(input)}
            </div>
          </div>
        </section>

        {/* Line Operations */}
        <section className="rounded-lg border p-4">
          <h2 className="mb-3 text-xl font-semibold">📝 Line Operations</h2>
          <div className="space-y-3">
            <div>
              <div className="mb-1 text-sm font-semibold text-gray-600">
                Sorted:
              </div>
              <pre className="rounded bg-gray-100 p-2 text-sm">
                {sortLines(input)}
              </pre>
            </div>
            <div>
              <div className="mb-1 text-sm font-semibold text-gray-600">
                Deduplicated:
              </div>
              <pre className="rounded bg-gray-100 p-2 text-sm">
                {deduplicateLines(input)}
              </pre>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="rounded-lg border p-4">
          <h2 className="mb-3 text-xl font-semibold">🔍 Statistics</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-semibold">Average word length:</span>{' '}
              {stats.averageWordLength} chars
            </div>
            <div>
              <span className="font-semibold">Average sentence length:</span>{' '}
              {stats.averageSentenceLength} words
            </div>
            <div>
              <span className="font-semibold">Unique words:</span>{' '}
              {stats.uniqueWords}
            </div>
            <div>
              <span className="font-semibold">Longest word:</span>{' '}
              {stats.longestWord}
            </div>
            <div>
              <span className="font-semibold">Shortest word:</span>{' '}
              {stats.shortestWord}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

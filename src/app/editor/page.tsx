'use client';

import { useState } from 'react';

import { LanguageSelector } from '@/components/editor/LanguageSelector';
import { MonacoEditor } from '@/components/editor/MonacoEditor';
import {
  getAllCounts,
  getTextStatistics,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  toTitleCase,
  toPascalCase,
  toUpperCase,
  toLowerCase,
  sortLines,
  deduplicateLines,
  reverseLines,
  addLineNumbers,
  removeLineNumbers,
  normalizeWhitespace,
  trimLines,
} from '@/lib/text';

export default function EditorPage() {
  const [content, setContent] = useState(
    `// Welcome to Textify Editor!
// Try the text processing tools on the right →

function helloWorld() {
  console.log("Hello, World!");
  return "Welcome to Textify";
}`
  );
  const [language, setLanguage] = useState('javascript');
  const [showMinimap, setShowMinimap] = useState(true);
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>('on');

  const counts = getAllCounts(content);
  const stats = getTextStatistics(content);

  // Text processing actions
  const applyTransformation = (fn: (text: string) => string) => {
    setContent(fn(content));
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-white px-6 py-4 dark:bg-gray-900">
        <div>
          <h1 className="text-2xl font-bold">Textify Editor</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powerful text editor with built-in transformations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector value={language} onChange={setLanguage} />
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <div className="flex flex-1 flex-col">
          {/* Editor controls */}
          <div className="flex items-center gap-4 border-b bg-gray-50 px-4 py-2 dark:bg-gray-800">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showMinimap}
                onChange={(e) => setShowMinimap(e.target.checked)}
                className="rounded"
              />
              Minimap
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={wordWrap === 'on'}
                onChange={(e) => setWordWrap(e.target.checked ? 'on' : 'off')}
                className="rounded"
              />
              Word Wrap
            </label>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <MonacoEditor
              value={content}
              onChange={setContent}
              language={language}
              height="100%"
              showMinimap={showMinimap}
              wordWrap={wordWrap}
            />
          </div>
        </div>

        {/* Sidebar - Text Processing Tools */}
        <aside className="w-80 overflow-y-auto border-l bg-white dark:bg-gray-900">
          <div className="p-4">
            {/* Statistics */}
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-semibold">📊 Statistics</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Words:
                  </span>
                  <span className="font-semibold">{counts.words}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Characters:
                  </span>
                  <span className="font-semibold">{counts.characters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Lines:
                  </span>
                  <span className="font-semibold">{counts.lines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Sentences:
                  </span>
                  <span className="font-semibold">{counts.sentences}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Reading Time:
                  </span>
                  <span className="font-semibold">{stats.readingTime}</span>
                </div>
              </div>
            </section>

            {/* Case Transformations */}
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-semibold">
                🔤 Case Transformations
              </h2>
              <div className="space-y-2">
                <ActionButton
                  onClick={() => applyTransformation(toUpperCase)}
                  label="UPPERCASE"
                />
                <ActionButton
                  onClick={() => applyTransformation(toLowerCase)}
                  label="lowercase"
                />
                <ActionButton
                  onClick={() => applyTransformation(toTitleCase)}
                  label="Title Case"
                />
                <ActionButton
                  onClick={() => applyTransformation(toCamelCase)}
                  label="camelCase"
                />
                <ActionButton
                  onClick={() => applyTransformation(toPascalCase)}
                  label="PascalCase"
                />
                <ActionButton
                  onClick={() => applyTransformation(toSnakeCase)}
                  label="snake_case"
                />
                <ActionButton
                  onClick={() => applyTransformation(toKebabCase)}
                  label="kebab-case"
                />
              </div>
            </section>

            {/* Line Operations */}
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-semibold">📝 Line Operations</h2>
              <div className="space-y-2">
                <ActionButton
                  onClick={() => applyTransformation(sortLines)}
                  label="Sort Lines"
                />
                <ActionButton
                  onClick={() => applyTransformation(deduplicateLines)}
                  label="Remove Duplicates"
                />
                <ActionButton
                  onClick={() => applyTransformation(reverseLines)}
                  label="Reverse Lines"
                />
                <ActionButton
                  onClick={() => applyTransformation(addLineNumbers)}
                  label="Add Line Numbers"
                />
                <ActionButton
                  onClick={() => applyTransformation(removeLineNumbers)}
                  label="Remove Line Numbers"
                />
              </div>
            </section>

            {/* Whitespace Operations */}
            <section className="mb-6">
              <h2 className="mb-3 text-lg font-semibold">
                ⚪ Whitespace & Formatting
              </h2>
              <div className="space-y-2">
                <ActionButton
                  onClick={() => applyTransformation(normalizeWhitespace)}
                  label="Normalize Whitespace"
                />
                <ActionButton
                  onClick={() => applyTransformation(trimLines)}
                  label="Trim Lines"
                />
              </div>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ActionButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      {label}
    </button>
  );
}

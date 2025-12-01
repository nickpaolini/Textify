/**
 * Monaco Editor Component
 *
 * A powerful code editor based on VS Code's Monaco Editor
 * Features: syntax highlighting, IntelliSense, find/replace, minimap
 */

'use client';

import Editor, { type OnMount } from '@monaco-editor/react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
  showMinimap?: boolean;
  wordWrap?: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  lineNumbers?: 'on' | 'off' | 'relative';
  fontSize?: number;
  tabSize?: number;
  className?: string;
}

/**
 * Supported languages for syntax highlighting
 */
export const SUPPORTED_LANGUAGES = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'scss', label: 'SCSS' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'sql', label: 'SQL' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'shell', label: 'Shell' },
  { value: 'dockerfile', label: 'Dockerfile' },
  { value: 'graphql', label: 'GraphQL' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'r', label: 'R' },
  { value: 'perl', label: 'Perl' },
  { value: 'lua', label: 'Lua' },
  { value: 'dart', label: 'Dart' },
  { value: 'elixir', label: 'Elixir' },
  { value: 'haskell', label: 'Haskell' },
  { value: 'scala', label: 'Scala' },
];

export function MonacoEditor({
  value,
  onChange,
  language = 'plaintext',
  height = '500px',
  readOnly = false,
  showMinimap = true,
  wordWrap = 'on',
  lineNumbers = 'on',
  fontSize = 14,
  tabSize = 2,
  className = '',
}: MonacoEditorProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Get the current theme (accounting for system theme)
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const monacoTheme = currentTheme === 'dark' ? 'vs-dark' : 'vs';

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Configure editor behavior
    editor.updateOptions({
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      wordBasedSuggestions: 'off',
    });

    // Add custom keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Prevent default save behavior
      // You can add custom save logic here
    });
  };

  if (!mounted) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-900 ${className}`}
        style={{ height }}
      >
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Editor
        height={height}
        language={language}
        value={value}
        theme={monacoTheme}
        onChange={(newValue) => onChange(newValue || '')}
        onMount={handleEditorMount}
        options={{
          readOnly,
          minimap: {
            enabled: showMinimap,
          },
          wordWrap,
          lineNumbers,
          fontSize,
          tabSize,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          bracketPairColorization: {
            enabled: true,
          },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          suggest: {
            showWords: true,
            showSnippets: true,
          },
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          matchBrackets: 'always',
          renderWhitespace: 'selection',
          renderLineHighlight: 'all',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          padding: {
            top: 16,
            bottom: 16,
          },
        }}
        loading={
          <div className="flex items-center justify-center" style={{ height }}>
            <p className="text-gray-500">Loading editor...</p>
          </div>
        }
      />
    </div>
  );
}

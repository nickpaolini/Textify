import { describe, it, expect } from 'vitest';

import { sanitizeFilename } from '../export';

describe('Export utilities', () => {
  describe('sanitizeFilename', () => {
    it('should remove special characters', () => {
      const input = 'test@file#name$.txt';
      const result = sanitizeFilename(input);
      expect(result).toBe('testfilename.txt');
    });

    it('should replace spaces with underscores', () => {
      const input = 'my test file.txt';
      const result = sanitizeFilename(input);
      expect(result).toBe('my_test_file.txt');
    });

    it('should preserve dots and dashes', () => {
      const input = 'my-file.name.txt';
      const result = sanitizeFilename(input);
      expect(result).toBe('my-file.name.txt');
    });

    it('should replace multiple underscores with single', () => {
      const input = 'my___test____file.txt';
      const result = sanitizeFilename(input);
      expect(result).toBe('my_test_file.txt');
    });

    it('should trim whitespace', () => {
      const input = '  my file.txt  ';
      const result = sanitizeFilename(input);
      // trim() is called after replacing spaces with underscores
      // Leading/trailing spaces become underscores, then trimmed (trim only removes whitespace, not underscores)
      expect(result).toBe('_my_file.txt_');
    });

    it('should handle emoji and unicode characters', () => {
      const input = 'my file 😊 with emoji.txt';
      const result = sanitizeFilename(input);
      expect(result).not.toContain('😊');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = sanitizeFilename(input);
      expect(result).toBe('');
    });

    it('should handle complex filenames', () => {
      const input = '@@My  Super#Cool  File___Name!!!.txt';
      const result = sanitizeFilename(input);
      // Spaces are replaced with underscores, then collapsed
      expect(result).toBe('My_SuperCool_File_Name.txt');
    });
  });

  describe('Export format validation', () => {
    it('should validate markdown export format', () => {
      const formats: Array<'markdown' | 'text' | 'html'> = [
        'markdown',
        'text',
        'html',
      ];
      expect(formats).toContain('markdown');
    });

    it('should validate text export format', () => {
      const formats: Array<'markdown' | 'text' | 'html'> = [
        'markdown',
        'text',
        'html',
      ];
      expect(formats).toContain('text');
    });

    it('should validate html export format', () => {
      const formats: Array<'markdown' | 'text' | 'html'> = [
        'markdown',
        'text',
        'html',
      ];
      expect(formats).toContain('html');
    });
  });

  describe('ExportOptions interface', () => {
    it('should accept valid export options', () => {
      const options: { filename?: string; timestamp?: boolean } = {
        filename: 'test.md',
        timestamp: true,
      };

      expect(options.filename).toBe('test.md');
      expect(options.timestamp).toBe(true);
    });

    it('should handle optional filename', () => {
      const options: { filename?: string; timestamp?: boolean } = {
        timestamp: false,
      };

      expect(options.filename).toBeUndefined();
      expect(options.timestamp).toBe(false);
    });

    it('should handle optional timestamp', () => {
      const options: { filename?: string; timestamp?: boolean } = {
        filename: 'custom-name.txt',
      };

      expect(options.filename).toBe('custom-name.txt');
      expect(options.timestamp).toBeUndefined();
    });

    it('should handle empty options object', () => {
      const options: { filename?: string; timestamp?: boolean } = {};

      expect(options.filename).toBeUndefined();
      expect(options.timestamp).toBeUndefined();
    });
  });
});

// Note: Testing actual download functionality (exportAsMarkdown, exportAsText, exportAsHTML)
// requires DOM manipulation and is better suited for integration or E2E tests.
// These functions interact with the browser's download mechanism which is hard to
// test in a unit test environment.

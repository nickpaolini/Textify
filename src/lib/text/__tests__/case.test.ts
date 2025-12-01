import { describe, expect, it } from 'vitest';

import {
  capitalizeFirst,
  capitalizeWords,
  invertCase,
  toAlternatingCase,
  toCamelCase,
  toConstantCase,
  toDotCase,
  toKebabCase,
  toLowerCase,
  toPascalCase,
  toSentenceCase,
  toSnakeCase,
  toTitleCase,
  toUpperCase,
} from '../case';

describe('Case Conversion', () => {
  describe('toUpperCase', () => {
    it('converts to uppercase', () => {
      expect(toUpperCase('hello world')).toBe('HELLO WORLD');
    });
  });

  describe('toLowerCase', () => {
    it('converts to lowercase', () => {
      expect(toLowerCase('HELLO WORLD')).toBe('hello world');
    });
  });

  describe('toTitleCase', () => {
    it('converts to title case', () => {
      expect(toTitleCase('hello world')).toBe('Hello World');
    });

    it('handles minor words correctly', () => {
      expect(toTitleCase('the lord of the rings')).toBe(
        'The Lord of the Rings'
      );
    });

    it('capitalizes first and last words', () => {
      expect(toTitleCase('a tale of two cities')).toBe('A Tale of Two Cities');
    });
  });

  describe('toSentenceCase', () => {
    it('converts to sentence case', () => {
      expect(toSentenceCase('hello WORLD')).toBe('Hello world');
    });
  });

  describe('toCamelCase', () => {
    it('converts to camelCase', () => {
      expect(toCamelCase('hello world')).toBe('helloWorld');
      expect(toCamelCase('hello-world')).toBe('helloWorld');
      expect(toCamelCase('hello_world')).toBe('helloWorld');
    });
  });

  describe('toPascalCase', () => {
    it('converts to PascalCase', () => {
      expect(toPascalCase('hello world')).toBe('HelloWorld');
      expect(toPascalCase('hello-world')).toBe('HelloWorld');
      expect(toPascalCase('hello_world')).toBe('HelloWorld');
    });
  });

  describe('toSnakeCase', () => {
    it('converts to snake_case', () => {
      expect(toSnakeCase('hello world')).toBe('hello_world');
      expect(toSnakeCase('helloWorld')).toBe('hello_world');
      expect(toSnakeCase('hello-world')).toBe('hello_world');
    });
  });

  describe('toKebabCase', () => {
    it('converts to kebab-case', () => {
      expect(toKebabCase('hello world')).toBe('hello-world');
      expect(toKebabCase('helloWorld')).toBe('hello-world');
      expect(toKebabCase('hello_world')).toBe('hello-world');
    });
  });

  describe('toConstantCase', () => {
    it('converts to CONSTANT_CASE', () => {
      expect(toConstantCase('hello world')).toBe('HELLO_WORLD');
      expect(toConstantCase('helloWorld')).toBe('HELLO_WORLD');
    });
  });

  describe('toDotCase', () => {
    it('converts to dot.case', () => {
      expect(toDotCase('hello world')).toBe('hello.world');
      expect(toDotCase('helloWorld')).toBe('hello.world');
    });
  });

  describe('invertCase', () => {
    it('inverts case', () => {
      expect(invertCase('Hello World')).toBe('hELLO wORLD');
    });
  });

  describe('toAlternatingCase', () => {
    it('alternates case starting with lowercase', () => {
      expect(toAlternatingCase('hello', false)).toBe('hElLo');
    });

    it('alternates case starting with uppercase', () => {
      expect(toAlternatingCase('hello', true)).toBe('HeLlO');
    });
  });

  describe('capitalizeWords', () => {
    it('capitalizes first letter of each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
    });
  });

  describe('capitalizeFirst', () => {
    it('capitalizes only first letter', () => {
      expect(capitalizeFirst('hello world')).toBe('Hello world');
    });
  });
});

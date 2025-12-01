# Testing Guide

This project uses a comprehensive testing setup with multiple layers of testing.

## Testing Stack

### Unit & Integration Tests (Vitest)

- **Framework**: [Vitest](https://vitest.dev/) - Fast, modern testing framework
- **React Testing**: [@testing-library/react](https://testing-library.com/react)
- **DOM Assertions**: [@testing-library/jest-dom](https://github.com/testing-library/jest-dom)
- **User Interactions**: [@testing-library/user-event](https://testing-library.com/docs/user-event/intro)
- **Environment**: jsdom (for DOM testing)

### E2E Tests (Playwright)

- **Framework**: [Playwright](https://playwright.dev/)
- **Browsers**: Chromium, Firefox, WebKit
- **Mobile Testing**: Pixel 5, iPhone 12 emulation

## Running Tests

### Unit & Integration Tests

```bash
# Run tests in watch mode (default for development)
npm test

# Run tests once (good for CI)
npm run test:run

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode with verbose output
npm run test:ci
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI mode
npm run test:e2e:ui

# Run E2E tests in headed mode (see browser)
npm run test:e2e:headed
```

### Type Checking

```bash
# Check TypeScript types without emitting files
npm run type-check
```

## Test File Locations

```
.
├── tests/                          # Test configuration
│   ├── setup.ts                    # Global test setup
│   └── README.md                   # This file
├── e2e/                            # End-to-end tests
│   ├── homepage.spec.ts
│   └── text-transformation.spec.ts
├── src/
│   ├── components/
│   │   └── __tests__/              # Component unit tests
│   │       └── ThemeToggle.test.tsx
│   └── lib/
│       └── __tests__/              # Utility function tests
│           ├── utils.test.ts
│           └── export.test.ts
└── vitest.config.ts                # Vitest configuration
```

## Writing Tests

### Unit Tests for Utilities

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../myUtility';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected output');
  });
});
```

### Component Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);

    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('complete user workflow', async ({ page }) => {
  await page.goto('/');

  // Find elements and interact
  const button = page.getByRole('button', { name: /submit/i });
  await button.click();

  // Verify results
  await expect(page.locator('.result')).toBeVisible();
});
```

## Coverage

Coverage reports are generated when running:

```bash
npm run test:coverage
```

Coverage reports are saved to `coverage/` directory:

- `coverage/index.html` - HTML report (open in browser)
- `coverage/lcov.info` - LCOV format (for CI tools)

### Coverage Thresholds

The project maintains the following coverage targets:

- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

## Mocking

### Mocking Next.js Router

Already configured in `tests/setup.ts`:

```typescript
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    // ... other router methods
  }),
}));
```

### Mocking localStorage

Already configured in `tests/setup.ts` with a mock implementation.

### Mocking Components

```typescript
vi.mock('../MyComponent', () => ({
  default: () => <div>Mocked Component</div>,
}));
```

### Mocking API Calls

```typescript
import { vi } from 'vitest';

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mocked data' }),
  })
) as any;
```

## Testing Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal component state
   - Use accessible queries (getByRole, getByLabelText)

2. **Use Testing Library Queries**
   - Prefer: `getByRole`, `getByLabelText`, `getByPlaceholderText`
   - Avoid: `getByTestId` (unless necessary)

3. **Arrange-Act-Assert Pattern**

   ```typescript
   it('should do something', () => {
     // Arrange: Set up test data
     const input = 'test';

     // Act: Perform action
     const result = myFunction(input);

     // Assert: Verify result
     expect(result).toBe('expected');
   });
   ```

4. **Clean Up After Tests**
   - Cleanup is automatic with Testing Library
   - For manual cleanup, use `afterEach` hooks

5. **Mock External Dependencies**
   - Mock API calls
   - Mock browser APIs not available in jsdom
   - Mock heavy third-party libraries

## Continuous Integration

The test suite is designed to run in CI environments:

```yaml
# Example GitHub Actions workflow
- name: Run tests
  run: npm run test:ci

- name: Run E2E tests
  run: npm run test:e2e

- name: Type check
  run: npm run type-check
```

## Troubleshooting

### Tests are slow

- Use `vi.mock()` to mock heavy dependencies
- Consider using `test.concurrent()` for independent tests
- Check if you're accidentally importing large modules

### E2E tests failing

- Ensure dev server is running (configured in playwright.config.ts)
- Check if browser binaries are installed: `npx playwright install`
- Use headed mode to debug: `npm run test:e2e:headed`

### Coverage not reaching thresholds

- Check `coverage/index.html` for uncovered lines
- Focus on testing critical paths first
- Consider if some code paths need refactoring

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)

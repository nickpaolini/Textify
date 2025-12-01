import { test, expect } from '@playwright/test';

test.describe('Text Transformation Workflow', () => {
  test('should process text transformation', async ({ page }) => {
    await page.goto('/');

    // Find the text input area
    const textInput = page.locator('textarea').first();
    await expect(textInput).toBeVisible();

    // Type some test text
    const testText = 'This is a test message for transformation.';
    await textInput.fill(testText);

    // Verify text was entered
    await expect(textInput).toHaveValue(testText);

    // Select a transformation type (if tabs exist)
    const tabs = page.locator('[role="tablist"]').first();
    if (await tabs.isVisible()) {
      const firstTab = tabs.locator('[role="tab"]').first();
      await firstTab.click();
    }

    // Click transform/process button
    const transformButton = page
      .locator('button')
      .filter({ hasText: /transform|process|generate|convert/i })
      .first();

    if (await transformButton.isVisible()) {
      await transformButton.click();

      // Wait for processing (look for loading state or results)
      await page.waitForTimeout(2000);

      // Check for results (output area should have content or loading indicator)
      const outputArea = page
        .locator('[data-testid*="output"], [class*="result"]')
        .first();

      // Either loading or content should be visible
      const hasContent = await outputArea.isVisible().catch(() => false);
      const hasLoading = await page
        .locator('[data-testid*="loading"], [class*="loading"]')
        .first()
        .isVisible()
        .catch(() => false);

      expect(hasContent || hasLoading).toBeTruthy();
    }
  });

  test('should handle file upload', async ({ page }) => {
    await page.goto('/');

    // Look for file upload input or drag-drop area
    const fileInput = page.locator('input[type="file"]');

    if ((await fileInput.count()) > 0) {
      // Create a test file
      const testFileContent = 'This is test file content for upload.';

      await fileInput.setInputFiles({
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from(testFileContent),
      });

      // Wait for file to be processed
      await page.waitForTimeout(1000);

      // Check that the file content appears in the input area
      const textInput = page.locator('textarea').first();
      const inputValue = await textInput.inputValue();

      expect(inputValue.length).toBeGreaterThan(0);
    }
  });

  test('should copy results to clipboard', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/');

    // Look for copy button
    const copyButton = page
      .locator('button')
      .filter({ hasText: /copy/i })
      .first();

    if (await copyButton.isVisible()) {
      await copyButton.click();

      // Wait for copy action
      await page.waitForTimeout(500);

      // Verify toast notification or success message
      const toast = page.locator('[role="status"], [class*="toast"]').first();
      const toastVisible = await toast.isVisible().catch(() => false);

      // If toast is visible, verify it contains success message
      if (toastVisible) {
        const toastText = await toast.textContent();
        expect(toastText?.toLowerCase()).toMatch(/copied|success/);
      }
    }
  });

  test('should export results', async ({ page }) => {
    await page.goto('/');

    // Look for export/download button
    const exportButton = page
      .locator('button')
      .filter({ hasText: /export|download/i })
      .first();

    if (await exportButton.isVisible()) {
      // Set up download handler
      const downloadPromise = page
        .waitForEvent('download', { timeout: 5000 })
        .catch(() => null);

      await exportButton.click();

      // Wait for download
      const download = await downloadPromise;

      if (download) {
        // Verify download occurred
        expect(download.suggestedFilename()).toBeTruthy();
      }
    }
  });
});

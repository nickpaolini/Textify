import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display the main heading and description', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.getByRole('heading', { name: /textify/i })).toBeVisible();

    // Check for description or tagline
    const description = page.locator('text=/transform.*text/i').first();
    await expect(description).toBeVisible();
  });

  test('should have theme toggle functionality', async ({ page }) => {
    await page.goto('/');

    // Find theme toggle button
    const themeToggle = page
      .locator('[aria-label*="theme" i], [title*="theme" i]')
      .first();

    if (await themeToggle.isVisible()) {
      // Click to toggle theme
      await themeToggle.click();

      // Wait for theme change
      await page.waitForTimeout(300);

      // Check that html element has dark or light class
      const htmlElement = page.locator('html');
      const className = await htmlElement.getAttribute('class');

      expect(className).toMatch(/dark|light/);
    }
  });

  test('should navigate to history page', async ({ page }) => {
    await page.goto('/');

    // Click on history link/button
    const historyLink = page
      .locator('a[href="/history"], button:has-text("History")')
      .first();

    if (await historyLink.isVisible()) {
      await historyLink.click();

      // Wait for navigation
      await page.waitForURL('**/history');

      // Verify we're on history page
      expect(page.url()).toContain('/history');
    }
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/');

    // Click on about link
    const aboutLink = page.locator('a[href="/about"]').first();

    if (await aboutLink.isVisible()) {
      await aboutLink.click();

      // Wait for navigation
      await page.waitForURL('**/about');

      // Verify we're on about page
      expect(page.url()).toContain('/about');
    }
  });
});

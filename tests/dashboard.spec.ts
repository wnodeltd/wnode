import { test, expect } from '@playwright/test';

test('Dashboard Top Fold Snapshot', async ({ page }) => {
  // Navigate to dashboard
  await page.goto('http://127.0.0.1:3001');

  // Wait for network idle and specific components to render
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('text=Command Centre Operations');
  
  // Wait for the Identity Header elements to stabilise (we expect the user or fallback state)
  await page.waitForSelector('header');

  // Take a full page screenshot or just the top fold
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.screenshot({ path: 'dashboard-top-fold-snapshot.png', fullPage: false });

  // Optional: Take a snapshot of the specific map fallback state if available
  const mapFallback = page.locator('text=No Geocoded Nodes Available');
  if (await mapFallback.isVisible()) {
    const mapBox = page.locator('#fleet-map').locator('..');
    await mapBox.screenshot({ path: 'dashboard-map-fallback-snapshot.png' });
  }

  // Basic assertion that the page loaded correctly
  await expect(page.locator('text=Command Centre Operations')).toBeVisible();
});

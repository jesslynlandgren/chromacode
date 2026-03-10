import { test, expect } from '@playwright/test';

test.describe('Editor page', () => {
  test('loads and shows the 4 Monaco preview tabs', async ({ page }) => {
    await page.goto('/editor');
    await expect(page.getByRole('tab', { name: '.ts', exact: true })).toBeVisible();
    await expect(page.getByRole('tab', { name: '.tsx', exact: true })).toBeVisible();
    await expect(page.getByRole('tab', { name: '.jsx', exact: true })).toBeVisible();
    await expect(page.getByRole('tab', { name: '.css', exact: true })).toBeVisible();
  });

  test('shows color picker placeholder when no token is selected', async ({ page }) => {
    await page.goto('/editor');
    await expect(page.getByText('Select a token to edit its color')).toBeVisible();
  });

  test('shows Export button', async ({ page }) => {
    await page.goto('/editor');
    await expect(page.getByRole('button', { name: /export/i })).toBeVisible();
  });

  test('Export menu opens and shows settings option', async ({ page }) => {
    await page.goto('/editor');
    await page.getByRole('button', { name: /export/i }).click();
    await expect(page.getByText('Copy settings.json')).toBeVisible();
    await expect(page.getByText('Download extension ZIP')).toBeVisible();
  });

  test('New button opens the new theme modal', async ({ page }) => {
    await page.goto('/editor');
    await page.getByRole('button', { name: /new/i }).click();
    await expect(page.getByText('New Theme')).toBeVisible();
  });

  test('clicking a workbench token opens the color picker', async ({ page }) => {
    await page.goto('/editor');
    await page.getByText('Background').first().click();
    await expect(page.locator('input[maxlength="9"]')).toBeVisible();
  });

  test('switching preview tabs changes active tab', async ({ page }) => {
    await page.goto('/editor');
    await page.getByRole('tab', { name: '.tsx', exact: true }).click();
    const tsxTab = page.getByRole('tab', { name: '.tsx', exact: true });
    await expect(tsxTab).toHaveAttribute('data-state', 'active');
  });
});

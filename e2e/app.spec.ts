import { expect, test } from '@playwright/test';

test.beforeEach(async ({ context, page, baseURL }) => {
  await context.route('**/*', route =>
    new URL(route.request().url()).origin === baseURL
      ? route.continue()
      : route.abort()
  );
  page.on('pageerror', error => { throw error; });
});

test('root redirects to the real login form and accepts input', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  const username = page.locator('input[placeholder="Username"]');
  const password = page.locator('input[placeholder="Password"]');
  await username.fill('offline-smoke-user');
  await password.fill('offline-smoke-password');
  await expect(username).toHaveValue('offline-smoke-user');
  await expect(password).toHaveAttribute('type', 'password');
  await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Bit Field Solutions' })).toBeVisible();
});

test('home inventory card preserves navigation and the Ionic menu works', async ({ page }) => {
  await page.goto('/home');
  const home = page.locator('app-home');
  await expect(home.locator('ion-card')).toHaveCount(4);
  await home.locator('ion-card').filter({ hasText: 'Inventory' }).click();
  await expect(page).toHaveURL(/\/inventory$/);
  const inventory = page.locator('app-inventory');
  await expect(inventory.locator('ion-title')).toHaveText('Inventory');
  await inventory.locator('ion-menu-button').click();
  await expect(page.locator('ion-menu')).toHaveClass(/show-menu/);
  await page.locator('ion-menu ion-item').filter({ hasText: /^\s*Home\s*$/ }).click();
  await expect(page).toHaveURL(/\/home$/);
  await expect(home.locator('ion-card')).toHaveCount(4);
});

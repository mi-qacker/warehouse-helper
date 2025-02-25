import {CONFIG} from '@/config';
import {test, expect} from '@playwright/test';

test('Navbar should display correctly', async ({page}) => {
  await page.goto('/');

  const appName = page.locator('a:has-text("Warehouse Helper")');
  await expect(appName).toBeVisible();

  const homeLink = page.locator('a:has-text("Home")');
  await expect(homeLink).toBeVisible();
  await expect(homeLink).toHaveAttribute('href', '/');

  const aboutLink = page.locator('a:has-text("About")');
  await expect(aboutLink).toBeVisible();
  await expect(aboutLink).toHaveAttribute('href', '/about');

  const documentationLink = page.locator('a:has-text("Docs")');
  await expect(documentationLink).toBeVisible();
  await expect(documentationLink).toHaveAttribute('href', CONFIG.DOCS_URL);
});

test('Navbar should work', async ({page}) => {
  await page.goto('/');

  const appName = page.locator('a:has-text("Warehouse Helper")');
  const homeLink = page.locator('a:has-text("Home")');
  const aboutLink = page.locator('a:has-text("About")');

  await appName.click();
  await expect(page).toHaveURL('/');

  await homeLink.click();
  await expect(page).toHaveURL('/');

  await aboutLink.click();
  await expect(page).toHaveURL('/about');
});

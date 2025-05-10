import {expect, test} from '@playwright/test';

test('Main page should display correctly', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot();
});

test('About page should display correctly', async ({page}) => {
  await page.goto('/about');
  await expect(page).toHaveScreenshot();
});

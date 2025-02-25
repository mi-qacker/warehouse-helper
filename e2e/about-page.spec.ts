import {test, expect} from '@playwright/test';

test('should title in about page', async ({page}) => {
  await page.goto('/about');
  await expect(page.locator('h1')).toContainText('About Page');
});

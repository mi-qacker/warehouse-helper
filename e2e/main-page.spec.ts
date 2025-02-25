import {test, expect} from '@playwright/test';

test('should title in main page', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Home');
});

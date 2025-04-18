import {test, expect} from '@playwright/test';

test.describe('Params Component', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('/');
  });

  test('should render all tabs', async ({page}) => {
    const tabs = page.locator('[role="tab"]');
    await expect(tabs).toHaveCount(2);
    await expect(tabs.nth(0)).toHaveText('Товары');
    await expect(tabs.nth(1)).toHaveText('Ячейки');
  });

  test('should switch between tabs', async ({page}) => {
    const tabs = page.locator('[role="tab"]');
    const panels = page.locator('[role="tabpanel"]');

    await tabs.nth(1).click();
    await expect(panels.nth(1)).toBeVisible();

    await tabs.nth(0).click();
    await expect(panels.nth(0)).toBeVisible();
  });

  test('should update URL when tab changes', async ({page}) => {
    const tabs = page.locator('[role="tab"]');

    await tabs.nth(1).click();
    await expect(page).toHaveURL(/tabIndex=1/);
  });

  test('should restore tab state from URL', async ({page}) => {
    await page.goto('/?tabIndex=1');
    const activeTab = page.locator('[role="tab"][aria-selected="true"]');
    await expect(activeTab).toHaveText('Ячейки');
  });
});

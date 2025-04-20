import {CONFIG} from '@/config';
import {test, expect} from '@playwright/test';

test('Navbar should display all links correctly', async ({page}) => {
  await page.goto('/');

  // Verify app name
  const appName = page.locator('nav a:has-text("Warehouse Helper")');
  await expect(appName).toBeVisible();
  await expect(appName).toHaveAttribute('href', '/');

  // Verify main navigation links in navbar
  const parametersLink = page.locator('nav a:has-text("Parameters")');
  await expect(parametersLink).toBeVisible();
  await expect(parametersLink).toHaveAttribute('href', '/parameters');

  const mapLink = page.locator('nav a:has-text("Map")');
  await expect(mapLink).toBeVisible();
  await expect(mapLink).toHaveAttribute('href', '/map');

  const placementLink = page.locator('nav a:has-text("Placement")');
  await expect(placementLink).toBeVisible();
  await expect(placementLink).toHaveAttribute('href', '/placement');

  const trailLink = page.locator('nav a:has-text("Trail")');
  await expect(trailLink).toBeVisible();
  await expect(trailLink).toHaveAttribute('href', '/trail');

  // Verify secondary links in navbar
  const docsLink = page.locator('nav a:has-text("Docs")');
  await expect(docsLink).toBeVisible();
  await expect(docsLink).toHaveAttribute('href', CONFIG.DOCS_URL);
  await expect(docsLink).toHaveAttribute('target', '_blank');

  const aboutLink = page.locator('nav a:has-text("About")');
  await expect(aboutLink).toBeVisible();
  await expect(aboutLink).toHaveAttribute('href', '/about');
});

test('Navbar navigation should work for all links', async ({page}) => {
  await page.goto('/');

  // Test home link
  const appName = page.locator('nav a:has-text("Warehouse Helper")');
  await appName.click();
  await expect(page).toHaveURL('/');

  // Test main navigation links in navbar
  const parametersLink = page.locator('nav a:has-text("Parameters")');
  await parametersLink.click();
  await expect(page).toHaveURL('/parameters');
  await page.goBack();

  const mapLink = page.locator('nav a:has-text("Map")');
  await mapLink.click();
  await expect(page).toHaveURL('/map');
  await page.goBack();

  const placementLink = page.locator('nav a:has-text("Placement")');
  await placementLink.click();
  await expect(page).toHaveURL('/placement');
  await page.goBack();

  const trailLink = page.locator('nav a:has-text("Trail")');
  await trailLink.click();
  await expect(page).toHaveURL('/trail');
  await page.goBack();

  // Test secondary links in navbar
  const aboutLink = page.locator('nav a:has-text("About")');
  await aboutLink.click();
  await expect(page).toHaveURL('/about');
});

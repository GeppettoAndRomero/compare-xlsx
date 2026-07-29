import { expect, test } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { waitReady } from './_helpers';

const fileA = fileURLToPath(new URL('../fixtures/a.xlsx', import.meta.url));
const fileB = fileURLToPath(new URL('../fixtures/b.xlsx', import.meta.url));

test.describe('Excel workbook comparison', () => {
  test('compares two real XLSX files and makes no upload request', async ({ page }) => {
    const external: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      if (
        !url.startsWith('http://localhost:4321') &&
        !url.startsWith('data:') &&
        !url.startsWith('blob:')
      ) {
        external.push(url);
      }
    });

    await page.goto('/compare-xlsx/');
    await waitReady(page);
    await page.locator('[data-testid="compare-input-a"]').setInputFiles(fileA);
    await page.locator('[data-testid="compare-input-b"]').setInputFiles(fileB);
    await page.getByRole('button', { name: 'Compare workbooks' }).click();

    const result = page.locator('[data-testid="comparison-result"]');
    await expect(result).toBeVisible();
    await expect(result).toContainText('Inventory');
    await expect(result).toContainText('Summary');
    await expect(page.locator('[data-testid="difference-row"]')).toHaveCount(5);
    await expect(page.locator('[data-testid="only-a-sheets"]')).toContainText(
      'Archive A'
    );
    await expect(page.locator('[data-testid="only-b-sheets"]')).toContainText(
      'Archive B'
    );

    const inventoryB3 = page
      .locator('[data-testid="difference-row"]')
      .filter({ hasText: 'Inventory' })
      .filter({ hasText: '20' })
      .filter({ hasText: '22' });
    await expect(inventoryB3).toHaveCount(1);

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toEqual(
      []
    );
  });

  test('exports the difference list as JSON', async ({ page }) => {
    await page.goto('/compare-xlsx/');
    await waitReady(page);
    await page.locator('[data-testid="compare-input-a"]').setInputFiles(fileA);
    await page.locator('[data-testid="compare-input-b"]').setInputFiles(fileB);
    await page.getByRole('button', { name: 'Compare workbooks' }).click();
    await expect(page.locator('[data-testid="comparison-result"]')).toBeVisible();

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export JSON' }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('xlsx-differences.json');

    const path = await download.path();
    expect(path).toBeTruthy();
    const exported = JSON.parse(readFileSync(path as string, 'utf8'));
    expect(exported.differentCellCount).toBe(5);
    expect(exported.differences).toHaveLength(5);
    expect(exported.sheetsOnlyInA).toEqual(['Archive A']);
    expect(exported.sheetsOnlyInB).toEqual(['Archive B']);
  });
});

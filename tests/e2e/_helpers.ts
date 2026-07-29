import { expect, type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const fileAPath = fileURLToPath(new URL('../fixtures/a.xlsx', import.meta.url));
const fileBPath = fileURLToPath(new URL('../fixtures/b.xlsx', import.meta.url));

export const XLSX_A_B64 = readFileSync(fileAPath).toString('base64');
export const XLSX_B_B64 = readFileSync(fileBPath).toString('base64');

export async function waitReady(page: Page): Promise<void> {
  await page.waitForFunction(
    () => (window as Record<string, unknown>).__toolReady === true
  );
}

/** Compare the bundled fixture pair through the page-wide drop path. */
export async function convert(page: Page): Promise<void> {
  await page.evaluate(
    ({ a, b }) => {
      const fromBase64 = (base64: string, name: string) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) {
          bytes[index] = binary.charCodeAt(index);
        }
        return new File([bytes], name, {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
      };

      window.dispatchEvent(
        new CustomEvent('filesDropped', {
          detail: [fromBase64(a, 'a.xlsx'), fromBase64(b, 'b.xlsx')],
        })
      );
    },
    { a: XLSX_A_B64, b: XLSX_B_B64 }
  );

  await expect(page.locator('[data-testid="comparison-result"]')).toBeVisible();
}

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  compareXlsxWorkbooks,
  compareSheetRows,
  differencesToCsv,
} from '@/utils/compareXlsxEngine';

describe('compareSheetRows', () => {
  it('matches by row and column indexes and reports changed cells', () => {
    const result = compareSheetRows(
      'Data',
      [
        ['Item', 'Quantity'],
        ['A', 10],
        ['B', 20],
      ],
      [
        ['Item', 'Quantity'],
        ['A', 12],
        ['B', 20],
      ]
    );

    expect(result.summary).toEqual({
      sheetName: 'Data',
      matchedRowCount: 2,
      differentCellCount: 1,
    });
    expect(result.differences).toEqual([
      {
        sheetName: 'Data',
        row: 2,
        column: 2,
        columnLabel: 'B',
        address: 'B2',
        valueA: '10',
        valueB: '12',
      },
    ]);
  });

  it('treats a missing value as a blank string', () => {
    const result = compareSheetRows('Data', [['A']], [['A', 'added']]);
    expect(result.differences[0]).toMatchObject({
      address: 'B1',
      valueA: '',
      valueB: 'added',
    });
  });

  it('produces spreadsheet column labels beyond Z', () => {
    const rowA = Array.from({ length: 27 }, () => '');
    const rowB = [...rowA];
    rowB[26] = 'changed';
    expect(compareSheetRows('Wide', [rowA], [rowB]).differences[0].address).toBe(
      'AA1'
    );
  });
});

describe('differencesToCsv', () => {
  it('quotes commas and double quotes', () => {
    const comparison = compareSheetRows('Sheet, "A"', [['old']], [['new']]);
    const csv = differencesToCsv(comparison.differences);
    expect(csv).toContain('"Sheet, ""A"""');
    expect(csv).toContain('"old","new"');
  });
});

describe('compareXlsxWorkbooks', () => {
  it('reads the generated XLSX fixtures with SheetJS', async () => {
    const mime =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const bytesA = readFileSync(
      fileURLToPath(new URL('../fixtures/a.xlsx', import.meta.url))
    );
    const bytesB = readFileSync(
      fileURLToPath(new URL('../fixtures/b.xlsx', import.meta.url))
    );

    const result = await compareXlsxWorkbooks(
      new File([bytesA], 'a.xlsx', { type: mime }),
      new File([bytesB], 'b.xlsx', { type: mime })
    );

    expect(result.comparedSheets.map((sheet) => sheet.sheetName)).toEqual([
      'Inventory',
      'Summary',
    ]);
    expect(result.matchedRowCount).toBe(5);
    expect(result.differentCellCount).toBe(5);
    expect(result.sheetsOnlyInA).toEqual(['Archive A']);
    expect(result.sheetsOnlyInB).toEqual(['Archive B']);
  });
});

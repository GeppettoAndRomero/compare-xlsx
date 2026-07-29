import { URL, fileURLToPath } from 'node:url';
import * as fs from 'node:fs';
import * as XLSX from 'xlsx';

const fixtureDirectory = fileURLToPath(new URL('.', import.meta.url));
XLSX.set_fs(fs);

function workbookWithSheets(sheets) {
  const workbook = XLSX.utils.book_new();
  for (const [name, rows] of sheets) {
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), name);
  }
  return workbook;
}

const workbookA = workbookWithSheets([
  [
    'Inventory',
    [
      ['Item', 'Count', 'Status', 'Note'],
      ['Paper', 10, 'Stored', ''],
      ['Pens', 20, 'Stored', 'Blue'],
      ['Folders', 5, 'Ordered', ''],
    ],
  ],
  [
    'Summary',
    [
      ['Period', 'Value'],
      ['Q1', 100],
      ['Q2', 200],
    ],
  ],
  ['Archive A', [['Reference'], ['A-only']]],
]);

const workbookB = workbookWithSheets([
  [
    'Inventory',
    [
      ['Item', 'Count', 'Status', 'Note'],
      ['Paper', 10, 'Stored', ''],
      ['Pens', 22, 'Stored', 'Blue'],
      ['Folders', 5, 'Received', ''],
      ['Labels', 3, 'Stored', ''],
    ],
  ],
  [
    'Summary',
    [
      ['Period', 'Value'],
      ['Q1', 100],
      ['Q2', 200],
    ],
  ],
  ['Archive B', [['Reference'], ['B-only']]],
]);

XLSX.writeFile(workbookA, `${fixtureDirectory}a.xlsx`, {
  bookType: 'xlsx',
  compression: true,
});
XLSX.writeFile(workbookB, `${fixtureDirectory}b.xlsx`, {
  bookType: 'xlsx',
  compression: true,
});

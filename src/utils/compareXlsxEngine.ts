import { AppError } from './appError';

export type CompareStage =
  | 'loading-library'
  | 'reading-a'
  | 'reading-b'
  | 'comparing';

export interface CompareProgress {
  stage: CompareStage;
  completed: number;
  total: number;
}

export interface CellDifference {
  sheetName: string;
  row: number;
  column: number;
  columnLabel: string;
  address: string;
  valueA: string;
  valueB: string;
}

export interface SheetComparisonSummary {
  sheetName: string;
  matchedRowCount: number;
  differentCellCount: number;
}

export interface WorkbookComparisonResult {
  fileAName: string;
  fileBName: string;
  comparedSheets: SheetComparisonSummary[];
  sheetsOnlyInA: string[];
  sheetsOnlyInB: string[];
  differences: CellDifference[];
  matchedRowCount: number;
  differentCellCount: number;
}

export type CompareProgressCallback = (progress: CompareProgress) => void;

type CellValue = unknown;
type SheetRows = CellValue[][];

function stringifyCellValue(value: CellValue): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

function columnLabel(columnIndex: number): string {
  let dividend = columnIndex + 1;
  let label = '';

  while (dividend > 0) {
    const remainder = (dividend - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    dividend = Math.floor((dividend - 1) / 26);
  }

  return label;
}

export function compareSheetRows(
  sheetName: string,
  rowsA: SheetRows,
  rowsB: SheetRows
): { summary: SheetComparisonSummary; differences: CellDifference[] } {
  const differences: CellDifference[] = [];
  const rowCount = Math.max(rowsA.length, rowsB.length);
  let matchedRowCount = 0;

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const rowA = rowsA[rowIndex] ?? [];
    const rowB = rowsB[rowIndex] ?? [];
    const columnCount = Math.max(rowA.length, rowB.length);
    let rowMatches = true;

    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const valueA = stringifyCellValue(rowA[columnIndex]);
      const valueB = stringifyCellValue(rowB[columnIndex]);
      if (valueA === valueB) continue;

      rowMatches = false;
      const label = columnLabel(columnIndex);
      differences.push({
        sheetName,
        row: rowIndex + 1,
        column: columnIndex + 1,
        columnLabel: label,
        address: `${label}${rowIndex + 1}`,
        valueA,
        valueB,
      });
    }

    if (rowMatches) matchedRowCount += 1;
  }

  return {
    summary: {
      sheetName,
      matchedRowCount,
      differentCellCount: differences.length,
    },
    differences,
  };
}

async function readWorkbook(
  file: File,
  read: (data: ArrayBuffer, options: { type: 'array' }) => {
    SheetNames: string[];
    Sheets: Record<string, unknown>;
  }
) {
  try {
    return read(await file.arrayBuffer(), { type: 'array' });
  } catch {
    throw new AppError('errUnreadableWorkbook');
  }
}

export async function compareXlsxWorkbooks(
  fileA: File,
  fileB: File,
  onProgress?: CompareProgressCallback
): Promise<WorkbookComparisonResult> {
  onProgress?.({ stage: 'loading-library', completed: 0, total: 2 });

  let XLSX: typeof import('xlsx');
  try {
    XLSX = await import('xlsx');
  } catch {
    throw new AppError('errLibraryLoad');
  }

  onProgress?.({ stage: 'reading-a', completed: 0, total: 2 });
  const workbookA = await readWorkbook(fileA, XLSX.read);

  onProgress?.({ stage: 'reading-b', completed: 1, total: 2 });
  const workbookB = await readWorkbook(fileB, XLSX.read);

  const namesB = new Set(workbookB.SheetNames);
  const commonSheetNames = workbookA.SheetNames.filter((name) => namesB.has(name));
  const sheetsOnlyInA = workbookA.SheetNames.filter((name) => !namesB.has(name));
  const namesA = new Set(workbookA.SheetNames);
  const sheetsOnlyInB = workbookB.SheetNames.filter((name) => !namesA.has(name));

  const comparedSheets: SheetComparisonSummary[] = [];
  const differences: CellDifference[] = [];
  let matchedRowCount = 0;

  onProgress?.({
    stage: 'comparing',
    completed: 0,
    total: commonSheetNames.length,
  });

  for (const [sheetIndex, sheetName] of commonSheetNames.entries()) {
    const worksheetA = workbookA.Sheets[sheetName];
    const worksheetB = workbookB.Sheets[sheetName];

    if (!worksheetA || !worksheetB) {
      throw new AppError('errUnreadableWorkbook');
    }

    // range: 0 preserves worksheet row numbers when the used range begins below row 1.
    const rowsA = XLSX.utils.sheet_to_json(worksheetA, {
      header: 1,
      raw: true,
      range: 0,
    }) as SheetRows;
    const rowsB = XLSX.utils.sheet_to_json(worksheetB, {
      header: 1,
      raw: true,
      range: 0,
    }) as SheetRows;

    const comparison = compareSheetRows(sheetName, rowsA, rowsB);
    comparedSheets.push(comparison.summary);
    differences.push(...comparison.differences);
    matchedRowCount += comparison.summary.matchedRowCount;

    onProgress?.({
      stage: 'comparing',
      completed: sheetIndex + 1,
      total: commonSheetNames.length,
    });
  }

  return {
    fileAName: fileA.name,
    fileBName: fileB.name,
    comparedSheets,
    sheetsOnlyInA,
    sheetsOnlyInB,
    differences,
    matchedRowCount,
    differentCellCount: differences.length,
  };
}

export function differencesToCsv(differences: CellDifference[]): string {
  const rows = [
    ['sheet', 'row', 'column', 'address', 'valueA', 'valueB'],
    ...differences.map((difference) => [
      difference.sheetName,
      String(difference.row),
      difference.columnLabel,
      difference.address,
      difference.valueA,
      difference.valueB,
    ]),
  ];

  return rows
    .map((row) =>
      row
        .map((value) => `"${value.replaceAll('"', '""')}"`)
        .join(',')
    )
    .join('\r\n');
}

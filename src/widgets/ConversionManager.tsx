import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import type { JSX } from 'preact';
import { AppButton } from './AppButton';
import { AppCard } from './AppCard';
import { ErrorToast } from './ErrorToast';
import { resolveErrorMessage } from '@/utils/appError';
import { validateFile } from '@/utils/fileValidation';
import {
  compareXlsxWorkbooks,
  differencesToCsv,
  type CellDifference,
  type CompareProgress,
  type WorkbookComparisonResult,
} from '@/utils/compareXlsxEngine';

interface ConversionManagerProps {
  locale?: string;
}

interface ErrorToastItem {
  id: string;
  message: string;
}

type FileSide = 'a' | 'b';

const strings = {
  en: {
    uploadHeading: 'Choose two Excel workbooks',
    uploadSubtitle:
      'Sheets with the same name are compared by row number and column position.',
    fileA: 'File A',
    fileB: 'File B',
    chooseFile: 'Choose a workbook',
    replaceFile: 'Replace workbook',
    dropHere: 'or drop one here',
    supported: 'XLSX, XLSM, or XLS',
    compare: 'Compare workbooks',
    loadingLibrary: 'Loading the workbook reader…',
    readingA: 'Reading File A…',
    readingB: 'Reading File B…',
    comparing: 'Comparing sheets ({completed}/{total})…',
    resultHeading: 'Comparison result',
    comparedSheetCount: 'Sheets compared',
    matchedRowCount: 'Matching rows',
    differentCellCount: 'Different cells',
    sheetSummary: 'Summary by sheet',
    sheet: 'Sheet',
    matchingRows: 'Matching rows',
    differentCells: 'Different cells',
    onlyA: 'Only in File A',
    onlyB: 'Only in File B',
    none: 'None',
    differences: 'Cell differences',
    noDifferences: 'No cell value differences were found in the matched sheets.',
    noMatchingSheets: 'The workbooks have no sheet names in common.',
    filterLabel: 'Filter differences',
    filterPlaceholder: 'Search sheet, cell, or value',
    showingDifferences: 'Showing {shown} of {total} differences',
    row: 'Row',
    column: 'Column',
    valueA: 'File A value',
    valueB: 'File B value',
    blank: '(blank)',
    exportJson: 'Export JSON',
    exportCsv: 'Export CSV',
    alignmentNote:
      'Rows are aligned by row number. Formatting is ignored. Matching moved rows or using a key column is outside this MVP.',
    notificationsAria: 'Notifications',
    errUnsupported:
      '“{name}” is not supported. Choose an .xlsx, .xlsm, or .xls workbook.',
    errExactlyTwo: 'Provide exactly two workbooks when dropping files on the page.',
    errMissingFiles: 'Choose both File A and File B before comparing.',
    errUnreadableWorkbook:
      'A workbook could not be read. It may be damaged, encrypted, or use an unsupported feature.',
    errLibraryLoad: 'The workbook reader could not be loaded.',
    errConversionFailed: 'The workbooks could not be compared.',
  },
  ja: {
    uploadHeading: '2つの Excel ブックを選択',
    uploadSubtitle: '同名のシートを、行番号と列位置に沿って比較します。',
    fileA: 'ファイル A',
    fileB: 'ファイル B',
    chooseFile: 'ブックを選択',
    replaceFile: 'ブックを変更',
    dropHere: 'またはここにドロップ',
    supported: 'XLSX・XLSM・XLS',
    compare: 'ブックを比較',
    loadingLibrary: 'ブック読み取り機能を読み込んでいます…',
    readingA: 'ファイル A を読み取っています…',
    readingB: 'ファイル B を読み取っています…',
    comparing: 'シートを比較しています（{completed}/{total}）…',
    resultHeading: '比較結果',
    comparedSheetCount: '比較したシート',
    matchedRowCount: '一致した行',
    differentCellCount: '異なるセル',
    sheetSummary: 'シート別サマリー',
    sheet: 'シート',
    matchingRows: '一致した行',
    differentCells: '異なるセル',
    onlyA: 'ファイル A のみに存在',
    onlyB: 'ファイル B のみに存在',
    none: 'なし',
    differences: 'セルの差分',
    noDifferences: '同名シートにセル値の差分は見つかりませんでした。',
    noMatchingSheets: '同じ名前のシートがありません。',
    filterLabel: '差分を絞り込む',
    filterPlaceholder: 'シート名・セル・値で検索',
    showingDifferences: '{total}件中{shown}件の差分を表示',
    row: '行',
    column: '列',
    valueA: 'ファイル A の値',
    valueB: 'ファイル B の値',
    blank: '（空欄）',
    exportJson: 'JSON を出力',
    exportCsv: 'CSV を出力',
    alignmentNote:
      '行は行番号で対応付け、書式の違いは比較しません。移動した行の検出やキー列による対応付けは、このMVPの対象外です。',
    notificationsAria: '通知',
    errUnsupported:
      '「{name}」は対象外です。.xlsx、.xlsm、.xls のいずれかを選んでください。',
    errExactlyTwo: 'ページへドロップする場合は、ブックを2ファイル指定してください。',
    errMissingFiles: '比較する前にファイル A とファイル B を選んでください。',
    errUnreadableWorkbook:
      'ブックを読み取れませんでした。破損、暗号化、または未対応の機能が含まれている可能性があります。',
    errLibraryLoad: 'ブック読み取り機能を読み込めませんでした。',
    errConversionFailed: 'ブックを比較できませんでした。',
  },
  zh: {
    uploadHeading: '选择两个 Excel 工作簿',
    uploadSubtitle: '按行号和列位置比较名称相同的工作表。',
    fileA: '文件 A',
    fileB: '文件 B',
    chooseFile: '选择工作簿',
    replaceFile: '更换工作簿',
    dropHere: '或拖放到这里',
    supported: 'XLSX、XLSM 或 XLS',
    compare: '比较工作簿',
    loadingLibrary: '正在加载工作簿读取组件…',
    readingA: '正在读取文件 A…',
    readingB: '正在读取文件 B…',
    comparing: '正在比较工作表（{completed}/{total}）…',
    resultHeading: '比较结果',
    comparedSheetCount: '已比较工作表',
    matchedRowCount: '相同行',
    differentCellCount: '不同单元格',
    sheetSummary: '各工作表摘要',
    sheet: '工作表',
    matchingRows: '相同行',
    differentCells: '不同单元格',
    onlyA: '仅文件 A 中存在',
    onlyB: '仅文件 B 中存在',
    none: '无',
    differences: '单元格差异',
    noDifferences: '同名工作表中没有发现单元格值差异。',
    noMatchingSheets: '两个工作簿中没有同名工作表。',
    filterLabel: '筛选差异',
    filterPlaceholder: '搜索工作表、单元格或值',
    showingDifferences: '共 {total} 项差异，当前显示 {shown} 项',
    row: '行',
    column: '列',
    valueA: '文件 A 的值',
    valueB: '文件 B 的值',
    blank: '（空白）',
    exportJson: '导出 JSON',
    exportCsv: '导出 CSV',
    alignmentNote:
      '行按行号对应，格式差异不参与比较。识别移动的行或按关键列对应不在此 MVP 范围内。',
    notificationsAria: '通知',
    errUnsupported: '不支持“{name}”。请选择 .xlsx、.xlsm 或 .xls 工作簿。',
    errExactlyTwo: '向页面拖放文件时，请提供两个工作簿。',
    errMissingFiles: '请先选择文件 A 和文件 B，再进行比较。',
    errUnreadableWorkbook: '无法读取工作簿。文件可能已损坏、加密或包含不支持的功能。',
    errLibraryLoad: '无法加载工作簿读取组件。',
    errConversionFailed: '无法比较这两个工作簿。',
  },
  de: {
    uploadHeading: 'Zwei Excel-Arbeitsmappen auswählen',
    uploadSubtitle:
      'Gleichnamige Tabellenblätter werden nach Zeilennummer und Spaltenposition verglichen.',
    fileA: 'Datei A',
    fileB: 'Datei B',
    chooseFile: 'Arbeitsmappe auswählen',
    replaceFile: 'Arbeitsmappe ersetzen',
    dropHere: 'oder hier ablegen',
    supported: 'XLSX, XLSM oder XLS',
    compare: 'Arbeitsmappen vergleichen',
    loadingLibrary: 'Arbeitsmappen-Leser wird geladen…',
    readingA: 'Datei A wird gelesen…',
    readingB: 'Datei B wird gelesen…',
    comparing: 'Tabellenblätter werden verglichen ({completed}/{total})…',
    resultHeading: 'Vergleichsergebnis',
    comparedSheetCount: 'Verglichene Blätter',
    matchedRowCount: 'Übereinstimmende Zeilen',
    differentCellCount: 'Abweichende Zellen',
    sheetSummary: 'Zusammenfassung je Blatt',
    sheet: 'Tabellenblatt',
    matchingRows: 'Übereinstimmende Zeilen',
    differentCells: 'Abweichende Zellen',
    onlyA: 'Nur in Datei A',
    onlyB: 'Nur in Datei B',
    none: 'Keine',
    differences: 'Zellabweichungen',
    noDifferences:
      'In den gleichnamigen Tabellenblättern wurden keine abweichenden Zellwerte gefunden.',
    noMatchingSheets: 'Die Arbeitsmappen haben keine gleichnamigen Tabellenblätter.',
    filterLabel: 'Abweichungen filtern',
    filterPlaceholder: 'Blatt, Zelle oder Wert suchen',
    showingDifferences: '{shown} von {total} Abweichungen angezeigt',
    row: 'Zeile',
    column: 'Spalte',
    valueA: 'Wert in Datei A',
    valueB: 'Wert in Datei B',
    blank: '(leer)',
    exportJson: 'JSON exportieren',
    exportCsv: 'CSV exportieren',
    alignmentNote:
      'Zeilen werden nach ihrer Nummer zugeordnet; Formatierungen werden ignoriert. Verschobene Zeilen und Schlüsselspalten sind nicht Teil dieses MVP.',
    notificationsAria: 'Benachrichtigungen',
    errUnsupported:
      '„{name}“ wird nicht unterstützt. Wähle eine .xlsx-, .xlsm- oder .xls-Arbeitsmappe.',
    errExactlyTwo: 'Beim Ablegen auf der Seite müssen genau zwei Arbeitsmappen angegeben werden.',
    errMissingFiles: 'Wähle Datei A und Datei B aus, bevor du den Vergleich startest.',
    errUnreadableWorkbook:
      'Eine Arbeitsmappe konnte nicht gelesen werden. Sie ist möglicherweise beschädigt, verschlüsselt oder enthält eine nicht unterstützte Funktion.',
    errLibraryLoad: 'Der Arbeitsmappen-Leser konnte nicht geladen werden.',
    errConversionFailed: 'Die Arbeitsmappen konnten nicht verglichen werden.',
  },
  es: {
    uploadHeading: 'Selecciona dos libros de Excel',
    uploadSubtitle:
      'Se comparan las hojas con el mismo nombre por número de fila y posición de columna.',
    fileA: 'Archivo A',
    fileB: 'Archivo B',
    chooseFile: 'Seleccionar un libro',
    replaceFile: 'Cambiar el libro',
    dropHere: 'o suéltalo aquí',
    supported: 'XLSX, XLSM o XLS',
    compare: 'Comparar libros',
    loadingLibrary: 'Cargando el lector de libros…',
    readingA: 'Leyendo el archivo A…',
    readingB: 'Leyendo el archivo B…',
    comparing: 'Comparando hojas ({completed}/{total})…',
    resultHeading: 'Resultado de la comparación',
    comparedSheetCount: 'Hojas comparadas',
    matchedRowCount: 'Filas coincidentes',
    differentCellCount: 'Celdas diferentes',
    sheetSummary: 'Resumen por hoja',
    sheet: 'Hoja',
    matchingRows: 'Filas coincidentes',
    differentCells: 'Celdas diferentes',
    onlyA: 'Solo en el archivo A',
    onlyB: 'Solo en el archivo B',
    none: 'Ninguna',
    differences: 'Diferencias de celdas',
    noDifferences:
      'No se encontraron diferencias de valores en las hojas con el mismo nombre.',
    noMatchingSheets: 'Los libros no tienen hojas con el mismo nombre.',
    filterLabel: 'Filtrar diferencias',
    filterPlaceholder: 'Buscar hoja, celda o valor',
    showingDifferences: 'Se muestran {shown} de {total} diferencias',
    row: 'Fila',
    column: 'Columna',
    valueA: 'Valor del archivo A',
    valueB: 'Valor del archivo B',
    blank: '(vacío)',
    exportJson: 'Exportar JSON',
    exportCsv: 'Exportar CSV',
    alignmentNote:
      'Las filas se relacionan por número y no se comparan los formatos. Detectar filas movidas o usar una columna clave queda fuera de este MVP.',
    notificationsAria: 'Notificaciones',
    errUnsupported:
      '«{name}» no es compatible. Selecciona un libro .xlsx, .xlsm o .xls.',
    errExactlyTwo: 'Al soltar archivos en la página, proporciona exactamente dos libros.',
    errMissingFiles: 'Selecciona el archivo A y el archivo B antes de comparar.',
    errUnreadableWorkbook:
      'No se pudo leer uno de los libros. Puede estar dañado, cifrado o contener una función no compatible.',
    errLibraryLoad: 'No se pudo cargar el lector de libros.',
    errConversionFailed: 'No se pudieron comparar los libros.',
  },
} as const;

type Copy = (typeof strings)[keyof typeof strings];

function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function visibleValue(value: string, blankLabel: string): JSX.Element | string {
  return value === '' ? <em style={{ color: 'var(--color-subtle)' }}>{blankLabel}</em> : value;
}

interface FileDropCardProps {
  id: string;
  title: string;
  file: File | null;
  copy: Copy;
  disabled: boolean;
  onFile: (file: File) => void;
}

function FileDropCard({
  id,
  title,
  file,
  copy,
  disabled,
  onFile,
}: FileDropCardProps) {
  const openPicker = () => {
    if (!disabled) document.getElementById(id)?.click();
  };

  const handleDrop = (event: JSX.TargetedDragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // Clear the page-wide frozen drop overlay without sending this one-sided
    // drop through its two-file handler.
    document.body.dispatchEvent(new Event('drop', { cancelable: true }));
    if (disabled) return;
    const droppedFile = event.dataTransfer?.files?.[0];
    if (droppedFile) onFile(droppedFile);
  };

  return (
    <div>
      <h3 style={{ marginBottom: 'var(--space-2)' }}>{title}</h3>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={`${title}: ${file ? copy.replaceFile : copy.chooseFile}`}
        data-testid={`drop-${id}`}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onDrop={handleDrop}
        style={{
          minHeight: '150px',
          padding: 'var(--space-4)',
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-bg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--space-2)',
          textAlign: 'center',
          cursor: disabled ? 'wait' : 'pointer',
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <span aria-hidden="true" style={{ fontSize: '2rem' }}>📊</span>
        {file ? (
          <>
            <strong style={{ wordBreak: 'break-word', maxWidth: '100%' }}>{file.name}</strong>
            <span class="num" style={{ color: 'var(--color-subtle)', fontSize: 'var(--fs-1)' }}>
              {(file.size / (1024 * 1024)).toFixed(2)} MB
            </span>
            <span style={{ color: 'var(--color-primary)', fontSize: 'var(--fs-2)' }}>
              {copy.replaceFile}
            </span>
          </>
        ) : (
          <>
            <strong>{copy.chooseFile}</strong>
            <span style={{ color: 'var(--color-subtle)', fontSize: 'var(--fs-2)' }}>
              {copy.dropHere}
            </span>
            <span style={{ color: 'var(--color-subtle)', fontSize: 'var(--fs-1)' }}>
              {copy.supported}
            </span>
          </>
        )}
      </div>
      <input
        id={id}
        data-testid={id}
        type="file"
        accept=".xlsx,.xlsm,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel.sheet.macroEnabled.12,application/vnd.ms-excel"
        disabled={disabled}
        onChange={(event) => {
          const selected = event.currentTarget.files?.[0];
          if (selected) onFile(selected);
          event.currentTarget.value = '';
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}

const tableWrapperStyle = {
  overflowX: 'auto',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
} as const;

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 'var(--fs-2)',
} as const;

const headerCellStyle = {
  padding: 'var(--space-2)',
  textAlign: 'left',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-surface-alt)',
  whiteSpace: 'nowrap',
} as const;

const cellStyle = {
  padding: 'var(--space-2)',
  textAlign: 'left',
  borderBottom: '1px solid var(--color-border-light)',
  verticalAlign: 'top',
} as const;

export function ConversionManager({ locale = 'en' }: ConversionManagerProps) {
  const copy = (strings[locale as keyof typeof strings] ?? strings.en) as Copy;
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [progress, setProgress] = useState<CompareProgress | null>(null);
  const [result, setResult] = useState<WorkbookComparisonResult | null>(null);
  const [filter, setFilter] = useState('');
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setErrorToasts((current) => [...current, { id, message }]);
  }, []);

  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const validateWorkbook = useCallback(
    (file: File): boolean => {
      if (validateFile(file).valid) return true;
      showErrorToast(copy.errUnsupported.replace('{name}', file.name));
      return false;
    },
    [copy.errUnsupported, showErrorToast]
  );

  const runComparison = useCallback(
    async (nextA: File | null, nextB: File | null) => {
      if (!nextA || !nextB) {
        showErrorToast(copy.errMissingFiles);
        return;
      }

      setIsComparing(true);
      setProgress({ stage: 'loading-library', completed: 0, total: 2 });
      setResult(null);
      setFilter('');

      try {
        const nextResult = await compareXlsxWorkbooks(nextA, nextB, setProgress);
        setResult(nextResult);
      } catch (error) {
        showErrorToast(
          resolveErrorMessage(error, copy as unknown as Record<string, string>)
        );
      } finally {
        setIsComparing(false);
        setProgress(null);
      }
    },
    [copy, showErrorToast]
  );

  const selectSide = useCallback(
    (side: FileSide, file: File) => {
      if (!validateWorkbook(file)) return;
      if (side === 'a') setFileA(file);
      else setFileB(file);
      setResult(null);
      setFilter('');
    },
    [validateWorkbook]
  );

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;

    const handleDroppedFiles = (event: Event) => {
      const files = (event as CustomEvent<File[]>).detail ?? [];
      if (files.length !== 2) {
        showErrorToast(copy.errExactlyTwo);
        window.dispatchEvent(new CustomEvent('filesProcessed'));
        return;
      }

      const [nextA, nextB] = files;
      if (!validateWorkbook(nextA) || !validateWorkbook(nextB)) {
        window.dispatchEvent(new CustomEvent('filesProcessed'));
        return;
      }

      setFileA(nextA);
      setFileB(nextB);
      void runComparison(nextA, nextB).finally(() => {
        window.dispatchEvent(new CustomEvent('filesProcessed'));
      });
    };

    window.addEventListener('filesDropped', handleDroppedFiles);
    return () => {
      window.removeEventListener('filesDropped', handleDroppedFiles);
      delete (globalThis as Record<string, unknown>).__toolReady;
    };
  }, [copy.errExactlyTwo, runComparison, showErrorToast, validateWorkbook]);

  const filteredDifferences = useMemo(() => {
    if (!result) return [];
    const query = filter.trim().toLocaleLowerCase();
    if (!query) return result.differences;

    return result.differences.filter((difference) =>
      [
        difference.sheetName,
        difference.address,
        difference.valueA,
        difference.valueB,
      ].some((value) => value.toLocaleLowerCase().includes(query))
    );
  }, [filter, result]);

  const progressText = useMemo(() => {
    if (!progress) return '';
    if (progress.stage === 'loading-library') return copy.loadingLibrary;
    if (progress.stage === 'reading-a') return copy.readingA;
    if (progress.stage === 'reading-b') return copy.readingB;
    return interpolate(copy.comparing, {
      completed: progress.completed,
      total: progress.total,
    });
  }, [copy, progress]);

  const progressPercent = useMemo(() => {
    if (!progress) return 0;
    if (progress.stage === 'loading-library') return 10;
    if (progress.stage === 'reading-a') return 30;
    if (progress.stage === 'reading-b') return 55;
    if (progress.total === 0) return 100;
    return 60 + Math.round((progress.completed / progress.total) * 40);
  }, [progress]);

  const exportJson = () => {
    if (!result) return;
    downloadBlob(
      new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' }),
      'xlsx-differences.json'
    );
  };

  const exportCsv = () => {
    if (!result) return;
    downloadBlob(
      new Blob([`\uFEFF${differencesToCsv(result.differences)}`], {
        type: 'text/csv;charset=utf-8',
      }),
      'xlsx-differences.csv'
    );
  };

  return (
    <div>
      <AppCard>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ marginBottom: 'var(--space-1)' }}>{copy.uploadHeading}</h2>
          <p style={{ margin: 0, color: 'var(--color-subtle)', fontSize: 'var(--fs-2)' }}>
            {copy.uploadSubtitle}
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--space-4)',
          }}
        >
          <FileDropCard
            id="compare-input-a"
            title={copy.fileA}
            file={fileA}
            copy={copy}
            disabled={isComparing}
            onFile={(file) => selectSide('a', file)}
          />
          <FileDropCard
            id="compare-input-b"
            title={copy.fileB}
            file={fileB}
            copy={copy}
            disabled={isComparing}
            onFile={(file) => selectSide('b', file)}
          />
        </div>

        <p
          style={{
            margin: 'var(--space-4) 0',
            color: 'var(--color-subtle)',
            fontSize: 'var(--fs-1)',
          }}
        >
          {copy.alignmentNote}
        </p>

        <AppButton
          disabled={!fileA || !fileB || isComparing}
          onClick={() => void runComparison(fileA, fileB)}
          ariaLabel={copy.compare}
        >
          {copy.compare}
        </AppButton>

        {isComparing && (
          <div
            role="status"
            data-testid="comparison-status"
            style={{ marginTop: 'var(--space-4)' }}
          >
            <p style={{ marginBottom: 'var(--space-2)' }}>{progressText}</p>
            <div
              class="app-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
            >
              <div class="app-progress__bar" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        )}
      </AppCard>

      {result && (
        <div
          role="region"
          aria-label={copy.resultHeading}
          data-testid="comparison-result"
          style={{
            marginTop: 'var(--space-5)',
            padding: 'var(--space-5)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-1)',
          }}
        >
          <h2>{copy.resultHeading}</h2>
          <p style={{ color: 'var(--color-subtle)', wordBreak: 'break-word' }}>
            {result.fileAName} ↔ {result.fileBName}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-5)',
            }}
          >
            {[
              [copy.comparedSheetCount, result.comparedSheets.length],
              [copy.matchedRowCount, result.matchedRowCount],
              [copy.differentCellCount, result.differentCellCount],
            ].map(([label, value]) => (
              <div
                style={{
                  padding: 'var(--space-3)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ color: 'var(--color-subtle)', fontSize: 'var(--fs-1)' }}>
                  {label}
                </div>
                <div class="num" style={{ fontSize: 'var(--fs-5)', fontWeight: 600 }}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          <h3>{copy.sheetSummary}</h3>
          {result.comparedSheets.length === 0 ? (
            <p>{copy.noMatchingSheets}</p>
          ) : (
            <div style={tableWrapperStyle}>
              <table style={tableStyle}>
                <caption class="visually-hidden">{copy.sheetSummary}</caption>
                <thead>
                  <tr>
                    <th scope="col" style={headerCellStyle}>{copy.sheet}</th>
                    <th scope="col" style={headerCellStyle}>{copy.matchingRows}</th>
                    <th scope="col" style={headerCellStyle}>{copy.differentCells}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.comparedSheets.map((summary) => (
                    <tr key={summary.sheetName}>
                      <th scope="row" style={cellStyle}>{summary.sheetName}</th>
                      <td class="num" style={cellStyle}>{summary.matchedRowCount}</td>
                      <td class="num" style={cellStyle}>{summary.differentCellCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 'var(--space-3)',
              margin: 'var(--space-5) 0',
            }}
          >
            <div data-testid="only-a-sheets">
              <h3>{copy.onlyA}</h3>
              {result.sheetsOnlyInA.length > 0 ? (
                <ul style={{ paddingLeft: 'var(--space-5)' }}>
                  {result.sheetsOnlyInA.map((name) => <li key={name}>{name}</li>)}
                </ul>
              ) : <p>{copy.none}</p>}
            </div>
            <div data-testid="only-b-sheets">
              <h3>{copy.onlyB}</h3>
              {result.sheetsOnlyInB.length > 0 ? (
                <ul style={{ paddingLeft: 'var(--space-5)' }}>
                  {result.sheetsOnlyInB.map((name) => <li key={name}>{name}</li>)}
                </ul>
              ) : <p>{copy.none}</p>}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-3)',
            }}
          >
            <h3 style={{ margin: 0 }}>{copy.differences}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <AppButton variant="secondary" onClick={exportJson}>
                {copy.exportJson}
              </AppButton>
              <AppButton variant="secondary" onClick={exportCsv}>
                {copy.exportCsv}
              </AppButton>
            </div>
          </div>

          {result.differences.length === 0 ? (
            <p>{copy.noDifferences}</p>
          ) : (
            <>
              <label
                for="difference-filter"
                style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: 500 }}
              >
                {copy.filterLabel}
              </label>
              <input
                id="difference-filter"
                class="app-field__input"
                type="search"
                value={filter}
                placeholder={copy.filterPlaceholder}
                onInput={(event) => setFilter(event.currentTarget.value)}
                style={{ width: '100%', marginBottom: 'var(--space-2)' }}
              />
              <p style={{ color: 'var(--color-subtle)', fontSize: 'var(--fs-1)' }}>
                {interpolate(copy.showingDifferences, {
                  shown: filteredDifferences.length,
                  total: result.differences.length,
                })}
              </p>
              <div style={{ ...tableWrapperStyle, maxHeight: '420px', overflow: 'auto' }}>
                <table style={tableStyle}>
                  <caption class="visually-hidden">{copy.differences}</caption>
                  <thead>
                    <tr>
                      <th scope="col" style={headerCellStyle}>{copy.sheet}</th>
                      <th scope="col" style={headerCellStyle}>{copy.row}</th>
                      <th scope="col" style={headerCellStyle}>{copy.column}</th>
                      <th scope="col" style={headerCellStyle}>{copy.valueA}</th>
                      <th scope="col" style={headerCellStyle}>{copy.valueB}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDifferences.map((difference: CellDifference) => (
                      <tr
                        key={`${difference.sheetName}-${difference.address}`}
                        data-testid="difference-row"
                      >
                        <th scope="row" style={cellStyle}>{difference.sheetName}</th>
                        <td class="num" style={cellStyle}>{difference.row}</td>
                        <td class="num" style={cellStyle}>{difference.columnLabel}</td>
                        <td style={{ ...cellStyle, minWidth: '120px', whiteSpace: 'pre-wrap' }}>
                          {visibleValue(difference.valueA, copy.blank)}
                        </td>
                        <td style={{ ...cellStyle, minWidth: '120px', whiteSpace: 'pre-wrap' }}>
                          {visibleValue(difference.valueB, copy.blank)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {errorToasts.length > 0 && (
        <div class="error-toast-container" aria-label={copy.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast
              key={toast.id}
              id={toast.id}
              message={toast.message}
              onClose={removeErrorToast}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}

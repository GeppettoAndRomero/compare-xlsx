import { describe, expect, it } from 'vitest';
import {
  sanitizeFileName,
  validateFile,
  validateFileExtension,
  validateFileMimeType,
  validateTotalSize,
} from '@/utils/fileValidation';

const fileStub = (name: string, type = '', size = 1): File =>
  ({ name, type, size }) as unknown as File;

describe('validateFileExtension', () => {
  it.each(['book.xlsx', 'book.XLSM', 'legacy.xls'])('accepts %s', (name) => {
    expect(validateFileExtension(name).valid).toBe(true);
  });

  it('rejects an unsupported extension and a missing extension', () => {
    expect(validateFileExtension('book.csv').valid).toBe(false);
    expect(validateFileExtension('book').valid).toBe(false);
  });
});

describe('validateFileMimeType', () => {
  it.each([
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel.sheet.macroEnabled.12',
    'application/vnd.ms-excel',
    'application/zip',
    'application/octet-stream',
    '',
  ])('accepts %s', (type) => {
    expect(validateFileMimeType(fileStub('book.xlsx', type)).valid).toBe(true);
  });

  it('rejects an unrelated MIME type', () => {
    expect(validateFileMimeType(fileStub('book.xlsx', 'text/plain')).valid).toBe(false);
  });
});

describe('validateFile', () => {
  it('accepts a workbook with a matching extension and MIME type', () => {
    expect(
      validateFile(
        fileStub(
          'book.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
      ).valid
    ).toBe(true);
  });

  it('rejects an unsupported extension even with a workbook MIME type', () => {
    expect(validateFile(fileStub('book.csv', 'application/vnd.ms-excel')).valid).toBe(
      false
    );
  });
});

describe('validateTotalSize', () => {
  it('does not impose a product-level byte cap', () => {
    expect(
      validateTotalSize([
        fileStub('a.xlsx', 'application/octet-stream', Number.MAX_SAFE_INTEGER),
      ]).valid
    ).toBe(true);
  });
});

describe('sanitizeFileName', () => {
  it('replaces path and reserved characters', () => {
    expect(sanitizeFileName('a/b\\c:d*e?.xlsx')).toBe('a_b_c_d_e_.xlsx');
  });
});

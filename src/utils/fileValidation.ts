export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_EXTENSIONS = ['.xlsx', '.xlsm', '.xls'];
const ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel.sheet.macroenabled.12',
  'application/vnd.ms-excel',
  'application/zip',
  'application/octet-stream',
];

export function validateFileExtension(fileName: string): ValidationResult {
  const dot = fileName.lastIndexOf('.');
  const extension = dot >= 0 ? fileName.toLowerCase().slice(dot) : '';

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported extension. Accepted formats: ${ALLOWED_EXTENSIONS.join(', ')}`,
    };
  }

  return { valid: true };
}

export function validateFileMimeType(file: File): ValidationResult {
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Unsupported MIME type: ${file.type}`,
    };
  }

  return { valid: true };
}

export function validateFile(file: File): ValidationResult {
  const extensionResult = validateFileExtension(file.name);
  if (!extensionResult.valid) return extensionResult;

  const mimeResult = validateFileMimeType(file);
  if (!mimeResult.valid) return mimeResult;

  return { valid: true };
}

/** Browser memory is the practical size limit; this tool imposes no byte cap. */
export function validateTotalSize(_files: File[]): ValidationResult {
  return { valid: true };
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[/\\?%*:|"<>]/g, '_');
}

/**
 * Workbook comparison has no user-configurable settings in the MVP.
 *
 * The index signature keeps the stamped, unused SettingsPanel type-checkable
 * without retaining image-conversion settings or defaults.
 */
export interface ConversionSettings {
  [key: string]: any;
}

export type OutputFormat = string;
export type ResizeMode = string;

export const DEFAULT_SETTINGS: ConversionSettings = {};

export function validateSettings(_settings: ConversionSettings): {
  valid: boolean;
  errors: Record<string, string>;
} {
  return { valid: true, errors: {} };
}

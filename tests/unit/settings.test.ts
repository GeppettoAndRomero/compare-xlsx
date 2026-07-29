import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, validateSettings } from '@/utils/settings';

describe('workbook comparison settings', () => {
  it('has no user-configurable options', () => {
    expect(DEFAULT_SETTINGS).toEqual({});
    expect(validateSettings(DEFAULT_SETTINGS)).toEqual({ valid: true, errors: {} });
  });
});

// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadSettings, saveSettings } from '@/utils/settingsStorage';
import { DEFAULT_SETTINGS } from '@/utils/settings';

describe('settingsStorage compatibility', () => {
  beforeEach(() => localStorage.clear());

  it('returns the empty defaults when nothing is stored', () => {
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('round-trips the empty settings object', () => {
    saveSettings(DEFAULT_SETTINGS);
    expect(loadSettings()).toEqual({});
  });

  it('falls back to the defaults on malformed JSON', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    localStorage.setItem('compare-xlsx-settings', '{not valid json');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    consoleError.mockRestore();
  });
});

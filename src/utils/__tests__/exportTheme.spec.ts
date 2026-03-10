import { describe, it, expect } from 'vitest';
import { exportToSettings, exportToExtension } from '../exportTheme';
import { DARK_PLUS_PRESET } from '@/constants';

describe('exportToSettings', () => {
  it('returns valid JSON string', () => {
    const result = exportToSettings(DARK_PLUS_PRESET);
    expect(() => JSON.parse(result)).not.toThrow();
  });

  it('includes workbench.colorCustomizations key', () => {
    const result = JSON.parse(exportToSettings(DARK_PLUS_PRESET));
    expect(result).toHaveProperty('workbench.colorCustomizations');
  });

  it('includes editor.tokenColorCustomizations key', () => {
    const result = JSON.parse(exportToSettings(DARK_PLUS_PRESET));
    expect(result).toHaveProperty('editor.tokenColorCustomizations');
    expect(result['editor.tokenColorCustomizations']).toHaveProperty('textMateRules');
  });

  it('includes editor.semanticTokenColorCustomizations key', () => {
    const result = JSON.parse(exportToSettings(DARK_PLUS_PRESET));
    expect(result).toHaveProperty('editor.semanticTokenColorCustomizations');
    expect(result['editor.semanticTokenColorCustomizations'].enabled).toBe(true);
  });
});

describe('exportToExtension', () => {
  it('returns a Blob', async () => {
    const blob = await exportToExtension(DARK_PLUS_PRESET);
    expect(blob).toBeInstanceOf(Blob);
  });

  it('returns a non-empty Blob (valid ZIP)', async () => {
    const blob = await exportToExtension(DARK_PLUS_PRESET);
    expect(blob.size).toBeGreaterThan(0);
  });
});

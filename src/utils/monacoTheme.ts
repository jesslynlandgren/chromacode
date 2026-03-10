import type { ThemeState } from '@/types';

export interface MonacoThemeData {
  base: 'vs-dark' | 'vs' | 'hc-black';
  inherit: boolean;
  rules: Array<{
    token: string;
    foreground?: string;
    fontStyle?: string;
  }>;
  semanticHighlighting: boolean;
  semanticTokenColors: Record<string, string | object>;
  colors: Record<string, string>;
}

export function buildMonacoTheme(state: ThemeState): MonacoThemeData {
  // Determine base from editor background luminance
  const bg = state.workbenchColors['editor.background'] ?? '#1e1e1e';
  const base = isLightColor(bg) ? 'vs' : 'vs-dark';

  const rules = state.tokenColors.flatMap((rule) => {
    const scopes = Array.isArray(rule.scope) ? rule.scope : [rule.scope];
    return scopes.map((scope) => ({
      token: scope,
      foreground: rule.settings.foreground?.replace('#', ''),
      fontStyle: rule.settings.fontStyle,
    }));
  });

  return {
    base,
    inherit: false,
    rules,
    semanticHighlighting: true,
    semanticTokenColors: state.semanticColors,
    colors: state.workbenchColors,
  };
}

function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '').slice(0, 6);
  if (clean.length < 6) return false;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // Perceived luminance
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

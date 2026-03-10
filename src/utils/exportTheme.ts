import type { ThemeState } from '@/types';

// Format 1: settings.json snippet
export function exportToSettings(theme: ThemeState): string {
  const textMateRules = theme.tokenColors.map((rule) => ({
    scope: rule.scope,
    settings: rule.settings,
  }));

  const output = {
    'workbench.colorCustomizations': theme.workbenchColors,
    'editor.tokenColorCustomizations': {
      textMateRules,
    },
    'editor.semanticTokenColorCustomizations': {
      enabled: true,
      rules: theme.semanticColors,
    },
  };

  return JSON.stringify(output, null, 2);
}

// Format 2: VS Code extension ZIP
export async function exportToExtension(theme: ThemeState): Promise<Blob> {
  // Dynamic import to keep jszip out of the server bundle
  const { default: JSZip } = await import('jszip');

  const slug = theme.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const themeJson = {
    name: theme.name,
    type: 'dark',
    colors: theme.workbenchColors,
    tokenColors: theme.tokenColors,
    semanticHighlighting: true,
    semanticTokenColors: theme.semanticColors,
  };

  const packageJson = {
    name: slug,
    displayName: theme.name,
    description: `${theme.name} color theme`,
    version: '1.0.0',
    engines: { vscode: '^1.75.0' },
    categories: ['Themes'],
    contributes: {
      themes: [
        {
          label: theme.name,
          uiTheme: 'vs-dark',
          path: `./themes/${slug}-color-theme.json`,
        },
      ],
    },
  };

  const zip = new JSZip();
  zip.file('package.json', JSON.stringify(packageJson, null, 2));
  zip.folder('themes')?.file(`${slug}-color-theme.json`, JSON.stringify(themeJson, null, 2));

  return zip.generateAsync({ type: 'blob' });
}

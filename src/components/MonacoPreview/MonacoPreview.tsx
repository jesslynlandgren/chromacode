'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeEditorUI } from '@/contexts/ThemeEditorUIContext';
import { buildMonacoTheme } from '@/utils/monacoTheme';
import { TS_SAMPLE, TSX_SAMPLE, JSX_SAMPLE, CSS_SAMPLE } from './codeSamples';
import type { PreviewTab } from '@/types';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGE_MAP: Record<PreviewTab, string> = {
  ts: 'typescript',
  tsx: 'typescript',
  jsx: 'javascript',
  css: 'css',
};

const SAMPLE_MAP: Record<PreviewTab, string> = {
  ts: TS_SAMPLE,
  tsx: TSX_SAMPLE,
  jsx: JSX_SAMPLE,
  css: CSS_SAMPLE,
};

const THEME_NAME = 'chromacode-preview';

export function MonacoPreview() {
  const { state: themeState } = useTheme();
  const { state: uiState } = useThemeEditorUI();
  const monacoRef = useRef<unknown>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rebuild Monaco theme whenever themeState changes (debounced 150ms)
  useEffect(() => {
    if (!monacoRef.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const m = monacoRef.current as {
        editor: {
          defineTheme: (name: string, data: unknown) => void;
          setTheme: (name: string) => void;
        };
      };
      m.editor.defineTheme(THEME_NAME, buildMonacoTheme(themeState));
      m.editor.setTheme(THEME_NAME);
    }, 150);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [themeState]);

  function handleMonacoMount(monacoInstance: unknown) {
    monacoRef.current = monacoInstance;
    const m = monacoInstance as {
      editor: {
        defineTheme: (name: string, data: unknown) => void;
        setTheme: (name: string) => void;
      };
    };
    m.editor.defineTheme(THEME_NAME, buildMonacoTheme(themeState));
    m.editor.setTheme(THEME_NAME);
  }

  const activeTab = uiState.activePreviewTab;

  return (
    <MonacoEditor
      height="100%"
      language={LANGUAGE_MAP[activeTab]}
      value={SAMPLE_MAP[activeTab]}
      theme={THEME_NAME}
      onMount={(_editor, monaco) => handleMonacoMount(monaco)}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        automaticLayout: true,
        fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
      }}
    />
  );
}

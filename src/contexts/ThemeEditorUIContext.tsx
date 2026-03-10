'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ThemeEditorUIState, PreviewTab } from '@/types';

const INITIAL_UI_STATE: ThemeEditorUIState = {
  selectedTokenKey: null,
  isAdvancedView: false,
  activePreviewTab: 'ts',
};

interface ThemeEditorUIContextValue {
  state: ThemeEditorUIState;
  setSelectedTokenKey: (key: string | null) => void;
  setIsAdvancedView: (val: boolean) => void;
  setActivePreviewTab: (tab: PreviewTab) => void;
}

const ThemeEditorUIContext = createContext<ThemeEditorUIContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export function ThemeEditorUIProvider({ children }: Props) {
  const [state, setState] = useState<ThemeEditorUIState>(INITIAL_UI_STATE);

  function setSelectedTokenKey(key: string | null) {
    setState((prev) => ({ ...prev, selectedTokenKey: key }));
  }

  function setIsAdvancedView(val: boolean) {
    setState((prev) => ({ ...prev, isAdvancedView: val }));
  }

  function setActivePreviewTab(tab: PreviewTab) {
    setState((prev) => ({ ...prev, activePreviewTab: tab }));
  }

  return (
    <ThemeEditorUIContext.Provider
      value={{ state, setSelectedTokenKey, setIsAdvancedView, setActivePreviewTab }}
    >
      {children}
    </ThemeEditorUIContext.Provider>
  );
}

export function useThemeEditorUI(): ThemeEditorUIContextValue {
  const ctx = useContext(ThemeEditorUIContext);
  if (!ctx) throw new Error('useThemeEditorUI must be used within ThemeEditorUIProvider');
  return ctx;
}

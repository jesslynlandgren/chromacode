'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeEditorUI } from '@/contexts/ThemeEditorUIContext';
import { TokenPanel } from '@/components/TokenPanel';
import { ThemePreviewTabs } from '@/components/ThemePreviewTabs';
import { ColorPicker } from '@/components/ColorPicker';
import { EditorHeader } from '@/components/EditorHeader';
import { WORKBENCH_TOKEN_GROUPS, TEXTMATE_TOKENS, SEMANTIC_TOKENS } from '@/constants';
import type { TokenLayerKey } from '@/types';
import classNames from 'classnames';

interface EditorClientProps {
  initialThemeId?: string;
}

export function EditorClient({ initialThemeId }: EditorClientProps) {
  const { state: themeState, dispatch } = useTheme();
  const { state: uiState } = useThemeEditorUI();
  const [savedThemeId, setSavedThemeId] = useState<number | null>(
    initialThemeId ? parseInt(initialThemeId) : null,
  );

  const selectedKey = uiState.selectedTokenKey as TokenLayerKey | null;

  useEffect(() => {
    if (!initialThemeId) return;
    fetch(`/api/themes/${initialThemeId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          dispatch({
            type: 'LOAD_THEME',
            theme: {
              name: data.name,
              basedOn: data.basedOn ?? null,
              workbenchColors: data.workbenchColors,
              tokenColors: data.tokenColors,
              semanticColors: data.semanticColors,
            },
          });
        }
      })
      .catch(() => {});
  }, [initialThemeId, dispatch]);

  function getColorForKey(key: TokenLayerKey | null): string {
    if (!key) return '#888888';
    if (key.startsWith('workbench:')) {
      const tokenId = key.slice('workbench:'.length);
      return themeState.workbenchColors[tokenId] ?? '#888888';
    }
    if (key.startsWith('textmate:')) {
      const scope = key.slice('textmate:'.length);
      const rule = themeState.tokenColors.find(
        (r) => r.scope === scope || (Array.isArray(r.scope) && r.scope.includes(scope)),
      );
      return rule?.settings.foreground ?? '#888888';
    }
    if (key.startsWith('semantic:')) {
      const tokenId = key.slice('semantic:'.length);
      const val = themeState.semanticColors[tokenId];
      if (!val) return '#888888';
      if (typeof val === 'string') return val;
      return val.foreground ?? '#888888';
    }
    return '#888888';
  }

  function getLabelForKey(key: TokenLayerKey | null): { label: string; scope?: string } {
    if (!key) return { label: '' };
    if (key.startsWith('workbench:')) {
      const tokenId = key.slice('workbench:'.length);
      for (const group of WORKBENCH_TOKEN_GROUPS) {
        const token = group.tokens.find((t) => t.key === tokenId);
        if (token) return { label: `${group.label}: ${token.label}` };
      }
      return { label: tokenId };
    }
    if (key.startsWith('textmate:')) {
      const scope = key.slice('textmate:'.length);
      const def = TEXTMATE_TOKENS.find((t) => t.scope === scope);
      return { label: def?.label ?? scope, scope };
    }
    if (key.startsWith('semantic:')) {
      const tokenId = key.slice('semantic:'.length);
      const def = SEMANTIC_TOKENS.find((t) => t.key === tokenId);
      return { label: def?.label ?? tokenId };
    }
    return { label: key };
  }

  function handleColorChange(value: string) {
    if (!selectedKey) return;
    if (selectedKey.startsWith('workbench:')) {
      dispatch({ type: 'SET_WORKBENCH_COLOR', token: selectedKey.slice('workbench:'.length), value });
    } else if (selectedKey.startsWith('textmate:')) {
      dispatch({ type: 'SET_TOKEN_COLOR', scope: selectedKey.slice('textmate:'.length), value });
    } else if (selectedKey.startsWith('semantic:')) {
      dispatch({ type: 'SET_SEMANTIC_COLOR', token: selectedKey.slice('semantic:'.length), value });
    }
  }

  const { label, scope } = getLabelForKey(selectedKey);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <EditorHeader savedThemeId={savedThemeId} onThemeSaved={setSavedThemeId} />
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Token Panel */}
        <TokenPanel />

        {/* Center: Monaco Preview */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ThemePreviewTabs />
        </div>

        {/* Right: Color Picker */}
        <div
          className={classNames([
            'flex-shrink-0 border-l border-border bg-card',
            'w-56 overflow-y-auto',
            !selectedKey && 'flex items-center justify-center',
          ])}
        >
          {selectedKey ? (
            <ColorPicker
              tokenKey={selectedKey}
              tokenLabel={label}
              tokenScope={scope}
              value={getColorForKey(selectedKey)}
              onChange={handleColorChange}
            />
          ) : (
            <p className="px-4 text-center text-xs text-muted-foreground">
              Select a token to edit its color
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

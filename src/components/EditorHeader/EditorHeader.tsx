'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ExportMenu } from '@/components/ExportMenu';
import { NewThemeModal } from '@/components/NewThemeModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import classNames from 'classnames';

export function EditorHeader() {
  const { state, dispatch } = useTheme();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.name);
  const [isNewThemeOpen, setIsNewThemeOpen] = useState(false);

  function handleNameClick() {
    setNameInput(state.name);
    setIsEditingName(true);
  }

  function handleNameBlur() {
    const trimmed = nameInput.trim();
    if (trimmed) dispatch({ type: 'SET_NAME', name: trimmed });
    setIsEditingName(false);
  }

  function handleNameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') e.currentTarget.blur();
    if (e.key === 'Escape') {
      setNameInput(state.name);
      setIsEditingName(false);
    }
  }

  return (
    <>
      <header
        className={classNames([
          'flex h-12 flex-shrink-0 items-center justify-between',
          'border-b border-border bg-card px-4',
        ])}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-tight text-primary">Chromacode</span>
          <span className="text-muted-foreground">/</span>
          {isEditingName ? (
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              className={classNames([
                'rounded border border-border bg-background px-2 py-0.5',
                'text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
              ])}
            />
          ) : (
            <button
              onClick={handleNameClick}
              className="rounded px-2 py-0.5 text-sm text-foreground hover:bg-accent"
            >
              {state.name}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs"
            onClick={() => setIsNewThemeOpen(true)}
          >
            <Plus className="h-3 w-3" />
            New
          </Button>
          <ExportMenu />
        </div>
      </header>

      <NewThemeModal open={isNewThemeOpen} onClose={() => setIsNewThemeOpen(false)} />
    </>
  );
}

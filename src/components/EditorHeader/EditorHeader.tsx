'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { useTheme } from '@/contexts/ThemeContext';
import { ExportMenu } from '@/components/ExportMenu';
import { NewThemeModal } from '@/components/NewThemeModal';
import { Button } from '@/components/ui/button';
import { Plus, Save, LogIn, LogOut } from 'lucide-react';
import classNames from 'classnames';

interface EditorHeaderProps {
  savedThemeId: number | null;
  onThemeSaved: (id: number | null) => void;
}

export function EditorHeader({ savedThemeId, onThemeSaved }: EditorHeaderProps) {
  const { state, dispatch } = useTheme();
  const { data: session } = useSession();
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(state.name);
  const [isNewThemeOpen, setIsNewThemeOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveLabel, setSaveLabel] = useState<'Save' | 'Saved!' | 'Error'>('Save');

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

  function handleNewTheme() {
    onThemeSaved(null);
    setSaveLabel('Save');
    setIsNewThemeOpen(true);
  }

  async function handleSave() {
    if (!session) {
      signIn('github', { callbackUrl: window.location.href });
      return;
    }
    setIsSaving(true);
    try {
      let ok = false;
      if (savedThemeId) {
        const res = await fetch(`/api/themes/${savedThemeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state),
        });
        ok = res.ok;
      } else {
        const res = await fetch('/api/themes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(state),
        });
        if (res.ok) {
          const data = await res.json();
          onThemeSaved(data.id);
          ok = true;
        }
      }
      setSaveLabel(ok ? 'Saved!' : 'Error');
      setTimeout(() => setSaveLabel('Save'), 2000);
    } finally {
      setIsSaving(false);
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
            onClick={handleNewTheme}
          >
            <Plus className="h-3 w-3" />
            New
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-3 w-3" />
            {isSaving ? 'Saving…' : saveLabel}
          </Button>
          <ExportMenu />
          {session ? (
            <div className="flex items-center gap-2">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'User'}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs"
                onClick={() => signOut()}
              >
                <LogOut className="h-3 w-3" />
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
              onClick={() => signIn('github', { callbackUrl: window.location.href })}
            >
              <LogIn className="h-3 w-3" />
              Sign in
            </Button>
          )}
        </div>
      </header>

      <NewThemeModal open={isNewThemeOpen} onClose={() => setIsNewThemeOpen(false)} />
    </>
  );
}

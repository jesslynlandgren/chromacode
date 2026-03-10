'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useTheme } from '@/contexts/ThemeContext';
import { PRESETS } from '@/constants';
import type { ThemeState } from '@/types';
import classNames from 'classnames';

interface Props {
  open: boolean;
  onClose: () => void;
}

type StartMode = 'blank' | 'preset' | 'import';

export function NewThemeModal({ open, onClose }: Props) {
  const { dispatch } = useTheme();
  const [mode, setMode] = useState<StartMode>('preset');
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESETS[0].basedOn ?? '');
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  function handleModeClick(m: StartMode) {
    setMode(m);
    setImportError(null);
  }

  function handleStart() {
    if (mode === 'blank') {
      dispatch({ type: 'RESET' });
      onClose();
      return;
    }
    if (mode === 'preset') {
      const preset = PRESETS.find((p) => p.basedOn === selectedPreset);
      if (preset) {
        dispatch({ type: 'LOAD_THEME', theme: preset });
      }
      onClose();
      return;
    }
    if (mode === 'import') {
      try {
        const parsed = JSON.parse(importJson) as Partial<ThemeState>;
        // Handle settings.json colorCustomizations format
        const theme: ThemeState = {
          name: 'Imported Theme',
          basedOn: null,
          workbenchColors: parsed.workbenchColors ?? {},
          tokenColors: parsed.tokenColors ?? [],
          semanticColors: parsed.semanticColors ?? {},
        };
        dispatch({ type: 'LOAD_THEME', theme });
        setImportError(null);
        onClose();
      } catch {
        setImportError('Invalid JSON. Paste a full theme JSON or settings.json snippet.');
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Theme</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2">
          {(['blank', 'preset', 'import'] as StartMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeClick(m)}
              className={classNames([
                'flex-1 rounded border px-3 py-2 text-sm capitalize transition-colors',
                mode === m
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-accent',
              ])}
            >
              {m}
            </button>
          ))}
        </div>

        {mode === 'preset' && (
          <div className="flex flex-col gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.basedOn}
                onClick={() => setSelectedPreset(preset.basedOn ?? '')}
                className={classNames([
                  'flex items-center gap-3 rounded border px-3 py-2 text-sm transition-colors',
                  selectedPreset === preset.basedOn
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-accent',
                ])}
              >
                <span
                  className="h-4 w-4 rounded-sm border border-white/10"
                  style={{
                    backgroundColor: preset.workbenchColors['editor.background'],
                  }}
                />
                {preset.basedOn}
              </button>
            ))}
          </div>
        )}

        {mode === 'import' && (
          <div className="flex flex-col gap-1.5">
            <Textarea
              placeholder="Paste theme JSON or settings.json snippet..."
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              rows={8}
              className="font-mono text-xs"
            />
            {importError && <p className="text-xs text-destructive">{importError}</p>}
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleStart}>
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

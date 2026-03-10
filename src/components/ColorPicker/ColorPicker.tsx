'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import classNames from 'classnames';

const MAX_RECENT = 8;

interface Props {
  tokenKey: string;
  tokenLabel: string;
  tokenScope?: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ tokenKey, tokenLabel, tokenScope, value, onChange }: Props) {
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [hexInput, setHexInput] = useState(value);

  function handlePickerChange(color: string) {
    setHexInput(color);
    onChange(color);
  }

  function handleHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setHexInput(raw);
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
      onChange(raw);
    }
  }

  function handleHexInputBlur() {
    if (/^#[0-9a-fA-F]{6}$/.test(hexInput)) {
      addRecent(hexInput);
    } else {
      setHexInput(value);
    }
  }

  function addRecent(color: string) {
    setRecentColors((prev) => {
      const filtered = prev.filter((c) => c !== color);
      return [color, ...filtered].slice(0, MAX_RECENT);
    });
  }

  function handleRecentClick(color: string) {
    setHexInput(color);
    onChange(color);
  }

  return (
    <div className={classNames(['flex flex-col gap-3 p-4'])}>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-foreground">{tokenLabel}</span>
        {tokenScope && (
          <span className="font-mono text-[10px] text-muted-foreground">{tokenScope}</span>
        )}
        <span className="font-mono text-[10px] text-muted-foreground">{tokenKey}</span>
      </div>

      <HexColorPicker color={value} onChange={handlePickerChange} className="!w-full" />

      <div className="flex items-center gap-2">
        <div
          className="h-7 w-7 flex-shrink-0 rounded border border-white/10"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={hexInput}
          onChange={handleHexInputChange}
          onBlur={handleHexInputBlur}
          className={classNames([
            'flex-1 rounded border border-input bg-transparent px-2 py-1',
            'font-mono text-sm text-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          ])}
          spellCheck={false}
          maxLength={9}
        />
      </div>

      {recentColors.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-muted-foreground">Recent</span>
          <div className="flex flex-wrap gap-1">
            {recentColors.map((color) => (
              <button
                key={color}
                title={color}
                className="token-swatch h-5 w-5 rounded"
                style={{ backgroundColor: color }}
                onClick={() => handleRecentClick(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

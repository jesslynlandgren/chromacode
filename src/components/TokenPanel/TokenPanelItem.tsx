'use client';

import classNames from 'classnames';

interface Props {
  tokenKey: string;
  label: string;
  color: string;
  isSelected: boolean;
  onSelect: (key: string) => void;
}

export function TokenPanelItem({ tokenKey, label, color, isSelected, onSelect }: Props) {
  function handleClick() {
    onSelect(tokenKey);
  }

  return (
    <button
      className={classNames([
        'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs',
        'transition-colors hover:bg-accent',
        isSelected && 'bg-accent text-accent-foreground',
      ])}
      onClick={handleClick}
    >
      <span
        className="h-3.5 w-3.5 flex-shrink-0 rounded-sm border border-white/10"
        style={{ backgroundColor: color || '#888888' }}
      />
      <span className="flex-1 truncate">{label}</span>
      <span className="font-mono text-[10px] text-muted-foreground">
        {color ? color.toUpperCase().slice(0, 7) : '—'}
      </span>
    </button>
  );
}

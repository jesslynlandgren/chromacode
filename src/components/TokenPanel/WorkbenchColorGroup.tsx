'use client';

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { TokenPanelItem } from './TokenPanelItem';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeEditorUI } from '@/contexts/ThemeEditorUIContext';
import type { WorkbenchTokenGroup } from '@/types';

interface Props {
  group: WorkbenchTokenGroup;
}

export function WorkbenchColorGroup({ group }: Props) {
  const { state: themeState } = useTheme();
  const { state: uiState, setSelectedTokenKey } = useThemeEditorUI();

  function handleSelect(key: string) {
    const fullKey = `workbench:${key}`;
    setSelectedTokenKey(uiState.selectedTokenKey === fullKey ? null : fullKey);
  }

  return (
    <Accordion type="single" collapsible defaultValue={group.label}>
      <AccordionItem value={group.label} className="border-0">
        <AccordionTrigger className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
          {group.label}
        </AccordionTrigger>
        <AccordionContent className="pb-0">
          {group.tokens.map((token) => (
            <TokenPanelItem
              key={token.key}
              tokenKey={`workbench:${token.key}`}
              label={token.label}
              color={themeState.workbenchColors[token.key] ?? ''}
              isSelected={uiState.selectedTokenKey === `workbench:${token.key}`}
              onSelect={() => handleSelect(token.key)}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

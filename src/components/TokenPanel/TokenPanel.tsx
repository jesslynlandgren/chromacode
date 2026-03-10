'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { WorkbenchColorGroup } from './WorkbenchColorGroup';
import { TokenPanelItem } from './TokenPanelItem';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeEditorUI } from '@/contexts/ThemeEditorUIContext';
import { WORKBENCH_TOKEN_GROUPS, TEXTMATE_TOKENS, SEMANTIC_TOKENS } from '@/constants';
import classNames from 'classnames';

export function TokenPanel() {
  const { state: themeState } = useTheme();
  const { state: uiState, setSelectedTokenKey, setIsAdvancedView } = useThemeEditorUI();

  function handleTabChange(val: string) {
    setIsAdvancedView(val === 'advanced');
  }

  function handleTextmateSelect(scope: string) {
    const key = `textmate:${scope}`;
    setSelectedTokenKey(uiState.selectedTokenKey === key ? null : key);
  }

  function handleSemanticSelect(tokenKey: string) {
    const key = `semantic:${tokenKey}`;
    setSelectedTokenKey(uiState.selectedTokenKey === key ? null : key);
  }

  function getTextmateColor(scope: string): string {
    const rule = themeState.tokenColors.find(
      (r) => r.scope === scope || (Array.isArray(r.scope) && r.scope.includes(scope)),
    );
    return rule?.settings.foreground ?? '';
  }

  function getSemanticColor(tokenKey: string): string {
    const val = themeState.semanticColors[tokenKey];
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val.foreground ?? '';
  }

  const visibleTextmate = uiState.isAdvancedView
    ? TEXTMATE_TOKENS
    : TEXTMATE_TOKENS.filter((t) => t.group === 'basic');

  return (
    <div
      className={classNames([
        'flex h-full flex-col overflow-hidden border-r border-border bg-card',
        'w-56 flex-shrink-0',
      ])}
    >
      <div className="border-b border-border px-3 py-2">
        <Tabs
          defaultValue="basic"
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="w-full">
            <TabsTrigger value="basic" className="flex-1 text-xs">
              Basic
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex-1 text-xs">
              Advanced
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-y-auto px-1 py-1">
        {/* Workbench Colors */}
        <div className="mb-1">
          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Workbench
          </p>
          {WORKBENCH_TOKEN_GROUPS.map((group) => (
            <WorkbenchColorGroup key={group.label} group={group} />
          ))}
        </div>

        {/* Syntax Tokens */}
        <div className="mb-1">
          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Syntax
          </p>
          {visibleTextmate.map((token) => (
            <TokenPanelItem
              key={token.scope}
              tokenKey={`textmate:${token.scope}`}
              label={token.label}
              color={getTextmateColor(token.scope)}
              isSelected={uiState.selectedTokenKey === `textmate:${token.scope}`}
              onSelect={() => handleTextmateSelect(token.scope)}
            />
          ))}
        </div>

        {/* Semantic Tokens */}
        <div>
          <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Semantic
          </p>
          {SEMANTIC_TOKENS.map((token) => (
            <TokenPanelItem
              key={token.key}
              tokenKey={`semantic:${token.key}`}
              label={token.label}
              color={getSemanticColor(token.key)}
              isSelected={uiState.selectedTokenKey === `semantic:${token.key}`}
              onSelect={() => handleSemanticSelect(token.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

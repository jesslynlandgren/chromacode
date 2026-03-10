'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { MonacoPreview } from '@/components/MonacoPreview';
import { useThemeEditorUI } from '@/contexts/ThemeEditorUIContext';
import type { PreviewTab } from '@/types';

const TABS: { value: PreviewTab; label: string }[] = [
  { value: 'ts', label: '.ts' },
  { value: 'tsx', label: '.tsx' },
  { value: 'jsx', label: '.jsx' },
  { value: 'css', label: '.css' },
];

export function ThemePreviewTabs() {
  const { state, setActivePreviewTab } = useThemeEditorUI();

  function handleTabChange(value: string) {
    setActivePreviewTab(value as PreviewTab);
  }

  return (
    <Tabs
      value={state.activePreviewTab}
      onValueChange={handleTabChange}
      className="flex h-full flex-col"
    >
      <TabsList className="w-full justify-start rounded-none border-b border-border bg-card px-2">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-none border-b-2 border-transparent px-3 py-1.5 text-xs data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-0 flex-1">
          {state.activePreviewTab === tab.value && <MonacoPreview />}
        </TabsContent>
      ))}
    </Tabs>
  );
}

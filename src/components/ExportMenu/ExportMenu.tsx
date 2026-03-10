'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { exportToSettings, exportToExtension } from '@/utils/exportTheme';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, Copy, ChevronDown } from 'lucide-react';

export function ExportMenu() {
  const { state } = useTheme();

  async function handleCopySettings() {
    const json = exportToSettings(state);
    await navigator.clipboard.writeText(json);
  }

  async function handleDownloadExtension() {
    const blob = await exportToExtension(state);
    const slug = state.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}.vsix.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          Export
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopySettings}>
          <Copy className="mr-2 h-4 w-4" />
          Copy settings.json
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDownloadExtension}>
          <Download className="mr-2 h-4 w-4" />
          Download extension ZIP
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

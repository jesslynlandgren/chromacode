import type { WorkbenchTokenGroup } from '@/types';

export const WORKBENCH_TOKEN_GROUPS: WorkbenchTokenGroup[] = [
  {
    label: 'Editor',
    tokens: [
      { key: 'editor.background', label: 'Background' },
      { key: 'editor.foreground', label: 'Foreground' },
      { key: 'editor.selectionBackground', label: 'Selection' },
      { key: 'editor.lineHighlightBackground', label: 'Line Highlight' },
      { key: 'editorCursor.foreground', label: 'Cursor' },
      { key: 'editorIndentGuide.background1', label: 'Indent Guide' },
      { key: 'editorBracketMatch.background', label: 'Bracket Match' },
    ],
  },
  {
    label: 'Activity Bar',
    tokens: [
      { key: 'activityBar.background', label: 'Background' },
      { key: 'activityBar.foreground', label: 'Active Icon' },
      { key: 'activityBar.inactiveForeground', label: 'Inactive Icon' },
    ],
  },
  {
    label: 'Side Bar',
    tokens: [
      { key: 'sideBar.background', label: 'Background' },
      { key: 'sideBar.foreground', label: 'Foreground' },
      { key: 'sideBarTitle.foreground', label: 'Title' },
    ],
  },
  {
    label: 'Title Bar',
    tokens: [
      { key: 'titleBar.activeBackground', label: 'Background' },
      { key: 'titleBar.activeForeground', label: 'Foreground' },
    ],
  },
  {
    label: 'Tabs',
    tokens: [
      { key: 'tab.activeBackground', label: 'Active Background' },
      { key: 'tab.inactiveBackground', label: 'Inactive Background' },
      { key: 'tab.activeForeground', label: 'Active Foreground' },
      { key: 'tab.inactiveForeground', label: 'Inactive Foreground' },
      { key: 'tab.border', label: 'Border' },
    ],
  },
  {
    label: 'Status Bar',
    tokens: [
      { key: 'statusBar.background', label: 'Background' },
      { key: 'statusBar.foreground', label: 'Foreground' },
    ],
  },
  {
    label: 'Terminal',
    tokens: [
      { key: 'terminal.background', label: 'Background' },
      { key: 'terminal.foreground', label: 'Foreground' },
      { key: 'terminal.ansiBlack', label: 'Black' },
      { key: 'terminal.ansiRed', label: 'Red' },
      { key: 'terminal.ansiGreen', label: 'Green' },
      { key: 'terminal.ansiYellow', label: 'Yellow' },
      { key: 'terminal.ansiBlue', label: 'Blue' },
      { key: 'terminal.ansiMagenta', label: 'Magenta' },
      { key: 'terminal.ansiCyan', label: 'Cyan' },
      { key: 'terminal.ansiWhite', label: 'White' },
    ],
  },
  {
    label: 'Git Decorations',
    tokens: [
      { key: 'gitDecoration.addedResourceForeground', label: 'Added' },
      { key: 'gitDecoration.modifiedResourceForeground', label: 'Modified' },
      { key: 'gitDecoration.deletedResourceForeground', label: 'Deleted' },
      { key: 'gitDecoration.untrackedResourceForeground', label: 'Untracked' },
    ],
  },
  {
    label: 'Minimap',
    tokens: [
      { key: 'minimap.background', label: 'Background' },
      { key: 'minimap.selectionHighlight', label: 'Selection' },
    ],
  },
  {
    label: 'Breadcrumbs',
    tokens: [
      { key: 'breadcrumb.foreground', label: 'Foreground' },
      { key: 'breadcrumb.activeSelectionForeground', label: 'Active' },
    ],
  },
];

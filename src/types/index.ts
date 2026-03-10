export interface TextMateSettings {
  foreground?: string;
  fontStyle?: string;
}

export interface TextMateRule {
  name?: string;
  scope: string | string[];
  settings: TextMateSettings;
}

export interface SemanticTokenRule {
  foreground?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export type SemanticColors = Record<string, string | SemanticTokenRule>;

export interface ThemeState {
  name: string;
  basedOn: string | null;
  workbenchColors: Record<string, string>;
  tokenColors: TextMateRule[];
  semanticColors: SemanticColors;
}

export type ThemeAction =
  | { type: 'SET_WORKBENCH_COLOR'; token: string; value: string }
  | { type: 'SET_TOKEN_COLOR'; scope: string; value: string }
  | { type: 'SET_SEMANTIC_COLOR'; token: string; value: string }
  | { type: 'SET_NAME'; name: string }
  | { type: 'LOAD_THEME'; theme: ThemeState }
  | { type: 'RESET' };

export interface ThemeEditorUIState {
  selectedTokenKey: string | null;
  isAdvancedView: boolean;
  activePreviewTab: PreviewTab;
}

export type PreviewTab = 'ts' | 'tsx' | 'jsx' | 'css';

export interface WorkbenchTokenGroup {
  label: string;
  tokens: WorkbenchTokenDef[];
}

export interface WorkbenchTokenDef {
  key: string;
  label: string;
  description?: string;
}

export interface TextMateTokenDef {
  scope: string;
  label: string;
  group: 'basic' | 'advanced';
}

export interface SemanticTokenDef {
  key: string;
  label: string;
}

export interface ThemeSaveData {
  id: number;
  name: string;
  basedOn: string | null;
  workbenchColors: Record<string, string>;
  tokenColors: TextMateRule[];
  semanticColors: SemanticColors;
  createdAt: string;
  updatedAt: string;
}

export type TokenLayerKey =
  | `workbench:${string}`
  | `textmate:${string}`
  | `semantic:${string}`;

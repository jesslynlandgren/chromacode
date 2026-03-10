import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemePreviewTabs } from '../ThemePreviewTabs';

vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="monaco-editor" />,
}));

vi.mock('@/contexts/ThemeEditorUIContext', () => ({
  useThemeEditorUI: () => ({
    state: { activePreviewTab: 'ts', selectedTokenKey: null, isAdvancedView: false },
    setActivePreviewTab: vi.fn(),
    setSelectedTokenKey: vi.fn(),
    setIsAdvancedView: vi.fn(),
  }),
}));

vi.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    state: {
      name: 'Test',
      basedOn: null,
      workbenchColors: {},
      tokenColors: [],
      semanticColors: {},
    },
    dispatch: vi.fn(),
  }),
}));

describe('ThemePreviewTabs', () => {
  it('renders all 4 tab triggers', () => {
    render(<ThemePreviewTabs />);
    expect(screen.getByText('.ts')).toBeInTheDocument();
    expect(screen.getByText('.tsx')).toBeInTheDocument();
    expect(screen.getByText('.jsx')).toBeInTheDocument();
    expect(screen.getByText('.css')).toBeInTheDocument();
  });
});

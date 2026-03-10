import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemePreviewTabs } from '../ThemePreviewTabs';

// Monaco editor is a browser-only package; mock it for jsdom tests
vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="monaco-editor" />,
}));

// Provide required context
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

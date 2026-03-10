import { describe, it, expect } from 'vitest';
import { themeReducer } from '../ThemeContext';
import { DARK_PLUS_PRESET, MONOKAI_PRESET } from '@/constants';

const initial = DARK_PLUS_PRESET;

describe('themeReducer', () => {
  it('SET_WORKBENCH_COLOR updates a color', () => {
    const next = themeReducer(initial, {
      type: 'SET_WORKBENCH_COLOR',
      token: 'editor.background',
      value: '#ff0000',
    });
    expect(next.workbenchColors['editor.background']).toBe('#ff0000');
  });

  it('SET_WORKBENCH_COLOR does not mutate state', () => {
    const next = themeReducer(initial, {
      type: 'SET_WORKBENCH_COLOR',
      token: 'editor.background',
      value: '#ff0000',
    });
    expect(initial.workbenchColors['editor.background']).toBe('#1e1e1e');
    expect(next).not.toBe(initial);
  });

  it('SET_TOKEN_COLOR updates existing rule', () => {
    const next = themeReducer(initial, {
      type: 'SET_TOKEN_COLOR',
      scope: 'comment',
      value: '#00ff00',
    });
    const rule = next.tokenColors.find((r) => r.scope === 'comment');
    expect(rule?.settings.foreground).toBe('#00ff00');
  });

  it('SET_TOKEN_COLOR adds new rule if scope is missing', () => {
    const next = themeReducer(initial, {
      type: 'SET_TOKEN_COLOR',
      scope: 'some.new.scope',
      value: '#abcdef',
    });
    const rule = next.tokenColors.find((r) => r.scope === 'some.new.scope');
    expect(rule?.settings.foreground).toBe('#abcdef');
  });

  it('SET_SEMANTIC_COLOR updates semantic token', () => {
    const next = themeReducer(initial, {
      type: 'SET_SEMANTIC_COLOR',
      token: 'class',
      value: '#ff00ff',
    });
    expect(next.semanticColors['class']).toBe('#ff00ff');
  });

  it('SET_NAME updates name and clears basedOn', () => {
    const next = themeReducer(initial, { type: 'SET_NAME', name: 'My Custom Theme' });
    expect(next.name).toBe('My Custom Theme');
    expect(next.basedOn).toBeNull();
  });

  it('LOAD_THEME replaces entire state', () => {
    const next = themeReducer(initial, { type: 'LOAD_THEME', theme: MONOKAI_PRESET });
    expect(next.name).toBe(MONOKAI_PRESET.name);
    expect(next.basedOn).toBe('Monokai');
  });

  it('RESET returns initial Dark+ preset', () => {
    const modified = themeReducer(initial, {
      type: 'SET_NAME',
      name: 'Modified',
    });
    const reset = themeReducer(modified, { type: 'RESET' });
    expect(reset.name).toBe(DARK_PLUS_PRESET.name);
  });
});

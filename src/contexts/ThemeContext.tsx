'use client';

import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { ThemeState, ThemeAction } from '@/types';
import { DARK_PLUS_PRESET } from '@/constants';

const INITIAL_STATE: ThemeState = DARK_PLUS_PRESET;

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_WORKBENCH_COLOR':
      return {
        ...state,
        workbenchColors: { ...state.workbenchColors, [action.token]: action.value },
      };
    case 'SET_TOKEN_COLOR': {
      const scope = action.scope;
      const existing = state.tokenColors.find(
        (r) => r.scope === scope || (Array.isArray(r.scope) && r.scope.includes(scope)),
      );
      if (existing) {
        return {
          ...state,
          tokenColors: state.tokenColors.map((r) =>
            r.scope === scope ? { ...r, settings: { ...r.settings, foreground: action.value } } : r,
          ),
        };
      }
      return {
        ...state,
        tokenColors: [
          ...state.tokenColors,
          { scope, settings: { foreground: action.value } },
        ],
      };
    }
    case 'SET_SEMANTIC_COLOR':
      return {
        ...state,
        semanticColors: { ...state.semanticColors, [action.token]: action.value },
      };
    case 'SET_NAME':
      return { ...state, name: action.name, basedOn: null };
    case 'LOAD_THEME':
      return action.theme;
    case 'RESET':
      return INITIAL_STATE;
    default:
      return state;
  }
}

interface ThemeContextValue {
  state: ThemeState;
  dispatch: React.Dispatch<ThemeAction>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface Props {
  children: ReactNode;
  initialState?: ThemeState;
}

export function ThemeProvider({ children, initialState = INITIAL_STATE }: Props) {
  const [state, dispatch] = useReducer(themeReducer, initialState);
  return <ThemeContext.Provider value={{ state, dispatch }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export { themeReducer };

# Chromacode — AI Context

VS Code theme builder. Users pick colors for workbench tokens, TextMate syntax tokens, and semantic tokens. Live Monaco editor preview. Export as settings.json or extension ZIP. Save/load themes with GitHub auth.

## Stack

- **Next.js 15** — App Router, async route params, server components
- **React 19** — no `React.FC`, explicit prop interfaces
- **TypeScript strict** — `interface` for shapes, `type` for unions/mapped types, `import type`
- **Tailwind CSS + shadcn/ui** — CSS vars, dark mode via `class` on `<html>`
- **Monaco Editor** — dynamic import (`ssr: false`), debounced 150ms theme rebuild
- **NextAuth v5** — GitHub OAuth, JWT strategy, `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`/`AUTH_SECRET`
- **Neon + Drizzle ORM** — `@neondatabase/serverless` HTTP adapter, `drizzle-orm/neon-http`
- **Vitest + React Testing Library** — unit tests in `src/**/__tests__/`
- **Playwright** — e2e tests in `e2e/`, webServer auto-starts for CI
- **GitHub Actions CI** — lint → typecheck → test → playwright on every push
- **Vercel** — auto-deploy on push to main, `db:push` runs before `next build`

## Coding Conventions

- `classNames([...])` array notation (never template literals for class merging)
- No inline arrow functions in JSX — define handlers as named functions
- No `useCallback` without proven perf need
- `useEffect` only for mount/cleanup — not for derived state
- `useReducer` for 3+ related fields, `useState` for isolated UI state
- One component per folder with barrel `index.ts`
- `__tests__/` subfolder co-located with component

## File Structure

```
src/
  app/
    layout.tsx          # root layout — wraps with <Providers> (SessionProvider)
    providers.tsx       # 'use client' SessionProvider wrapper
    page.tsx            # landing page
    editor/
      page.tsx          # server component — reads ?themeId searchParam, passes to EditorClient
      EditorClient.tsx  # 'use client' — full editor layout, loads theme by ID on mount
      layout.tsx        # wraps with ThemeProvider + ThemeEditorUIProvider
    themes/
      page.tsx          # server component — auth-gated themes dashboard
    api/
      auth/[...nextauth]/route.ts   # re-exports handlers from @/auth
      themes/route.ts               # GET (list) + POST (create)
      themes/[id]/route.ts          # GET + PUT + DELETE
  auth.ts               # NextAuth config — GitHub provider, JWT→DB user upsert
  db/
    index.ts            # Neon + Drizzle connection
    schema.ts           # users + themes tables
  types/index.ts        # ThemeState, ThemeAction, TextMateRule, SemanticColors, etc.
  contexts/
    ThemeContext.tsx         # useReducer — full theme state
    ThemeEditorUIContext.tsx # useState — selected token, active tab, advanced view
  constants/
    workbenchTokens.ts  # WORKBENCH_TOKEN_GROUPS (10 groups, ~60 tokens)
    textmateTokens.ts   # TEXTMATE_TOKENS (10 basic + 10 advanced)
    semanticTokens.ts   # SEMANTIC_TOKENS (13 tokens)
    presets.ts          # DARK_PLUS, LIGHT_PLUS, MONOKAI, GITHUB_DARK
  utils/
    cn.ts               # shadcn-style cn() — clsx + tailwind-merge
    monacoTheme.ts      # buildMonacoTheme(state) → MonacoThemeData
    exportTheme.ts      # exportToSettings() + exportToExtension() (dynamic jszip)
  components/
    ui/                 # shadcn components (accordion, button, dialog, etc.)
    ColorPicker/        # HexColorPicker from react-colorful + hex text input + recent colors
    TokenPanel/         # Basic/Advanced tabs, accordion groups, token items
    MonacoPreview/      # Monaco Editor (dynamic, SSR disabled)
    ThemePreviewTabs/   # 4 tabs: .ts .tsx .jsx .css
    ExportMenu/         # Dropdown: copy settings.json / download ZIP
    NewThemeModal/      # blank / preset / JSON import modes
    EditorHeader/       # theme name (inline edit), New, Save, Export, Sign in/out
e2e/
  editor.spec.ts        # Playwright tests — all use exact: true for tab role selectors
drizzle/                # generated migration files (if any)
drizzle.config.ts       # drizzle-kit config — dialect: postgresql
vercel.json             # buildCommand: "npm run db:push && next build"
```

## Key Patterns

### Route params (Next.js 15)
Always async — `params: Promise<{ id: string }>`, then `const { id } = await params`.

### Auth in server components
```ts
import { auth } from '@/auth';
const session = await auth();
if (!session) // unauthorized
session.user.id // DB user ID as string
```

### Auth in API routes
Same — `auth()` is callable anywhere server-side.

### Auth in client components
```ts
import { useSession, signIn, signOut } from 'next-auth/react';
const { data: session } = useSession();
signIn('github', { callbackUrl: window.location.href });
```

### DB queries
```ts
import { db } from '@/db';
import { themes } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
await db.select().from(themes).where(eq(themes.userId, parseInt(session.user.id)));
```

### Theme state shape
```ts
interface ThemeState {
  name: string;
  basedOn: string | null;
  workbenchColors: Record<string, string>;
  tokenColors: TextMateRule[];       // [{ scope, settings: { foreground } }]
  semanticColors: SemanticColors;    // Record<string, string | SemanticTokenRule>
}
```

### Token layer keys
`workbench:editor.background`, `textmate:comment`, `semantic:variable`

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (auto-set by Vercel/Neon integration) |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |
| `AUTH_SECRET` | Random secret — `openssl rand -base64 32` |
| `CHROMATIC_PROJECT_TOKEN` | Optional — Chromatic visual testing (CI job is commented out) |

## CI / Deployment

- CI runs on every push: lint → typecheck → vitest → playwright
- Playwright uses `webServer` to auto-start `npm run dev` — no external server needed
- Vitest scoped to `src/**/*.{spec,test}.{ts,tsx}` — e2e files excluded
- Chromatic job commented out in `.github/workflows/ci.yml` until token is configured
- Vercel auto-deploys `main` → production
- `db:push` runs before `next build` on every Vercel deploy (idempotent)
- `npm install --legacy-peer-deps` required due to Storybook peer conflicts
- No `package-lock.json` in repo — use `npm install`, not `npm ci`

## Known Gotchas

- Monaco Editor must be dynamically imported with `ssr: false` — it uses browser APIs
- `useSearchParams` in client components requires Suspense — avoid it; pass via server component props instead
- Storybook decorator `Story` param must be typed as `StoryFn` from `@storybook/react`
- `getByText('.ts')` in Playwright matches `.tsx` — always use `getByRole('tab', { name: '.ts', exact: true })`
- `session.user.id` is the DB integer ID coerced to string — `parseInt(session.user.id)` when querying
- `@vercel/postgres` is deprecated — use `@neondatabase/serverless` + `drizzle-orm/neon-http`

## What's Deferred

- Public theme gallery / sharing
- Custom domain
- Chromatic visual regression testing
- Phase 13: Landing page polish

# Chromacode

VS Code theme builder with live Monaco preview, full token coverage, and JSON/extension export. Users pick colors for workbench tokens, TextMate syntax tokens, and semantic tokens. Save/load themes with GitHub auth.

**Repo:** `jesslynlandgren/chromacode`
**Linear:** https://linear.app/jesslyn/project/chromacode-61a6469c4baa
**Deploy:** Vercel (auto-deploy on merge to main)

## About Jesslyn

- Senior developer and engineering manager. 10+ years shipping software, now leading through AI agents instead of typing code herself.
- **Communication**: Brief, back-and-forth, one question at a time. Don't present long lists — feed options interactively. When presenting options, use numbered lists so she can respond by number.
- **Conversation flow**: Never move on to a new topic or return to a previous topic until Jesslyn explicitly responds or agrees. If you ask a question or present options, wait for her answer.
- **Output**: Informal notes and checklists. Don't draft wording or example phrasing unless she specifically asks you to write/draft something.
- **Evidence over reassurance**: Show what you actually found — quotes, data, file contents. Never summarize away uncertainty or say "looks good" without showing why. Say "I don't know" or "I couldn't find this" rather than hedging.
- **Literal requests are literal**: "Show me the file" means print the contents inline. Don't paraphrase or summarize when she asks to see something.
- **Be resourceful**: Don't just check the obvious source. Think about where evidence would show up and go look. Try multiple angles before concluding something can't be found.

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

## Key Rules

1. **Investigate before asking.** Search the repo, read related files. Exhaust what you can learn before asking Jesslyn.
2. **Append, don't overwrite.** Never auto-add tasks — suggest in conversation, wait for confirmation.
3. **One question at a time.** Don't present long lists of questions. Feed them interactively.
4. **Save outputs to files.** Research, plans, and analysis get persisted. Never leave results only in chat.
5. **Always include dates.** ISO format (YYYY-MM-DD) on everything stored.
6. **Pull before running.** `git pull --rebase origin main` before making changes. If conflicts, stop and tell Jesslyn.
7. **Propagate corrections repo-wide.** When a fact is corrected, grep for the old value and update all active files.
8. **Skill wrappers are mandatory.** New skills need BOTH `.claude/commands/` AND `.github/prompts/` wrappers.
9. **Never use `tools:` in prompt frontmatter.** It silently disables tools. Only use `description:` and `agent:`.
10. **Informal direction capture.** When Jesslyn uses direction language ("from now on", "always", "never again", "stop doing"), propose an instruction file edit inline. If confirmed, apply it and scan for conflicts. If she doesn't respond, drop it.
11. **Self-improvement trigger.** When Jesslyn uses "you" or "yourself" critically ("fix yourself", "you keep doing X"), treat it as a `/jl-fix` moment: trace the problem through CLAUDE.md and skills, find root causes, propose edits.

## Quality Standards

See `standards/` in this repo for full details. Summary:

- **Unit tests**: 100% coverage enforced via vitest thresholds. AI writes all tests.
- **E2E tests**: Every user-facing feature gets a Playwright test.
- **CI**: Lint, typecheck, test (with coverage), e2e — all must pass before merge.
- **No direct push to main.** All changes go through PRs.
- **Merge to main = production deploy** via Vercel.

## Planning & Task Tracking

- Tasks are tracked in **Linear** under the [Chromacode project](https://linear.app/jesslyn/project/chromacode-61a6469c4baa).
- Planning happens in this repo via `/jl-plan-project` — brainstorm vision, define user jobs, stress-test, sequence work, harden requirements, create Linear tickets.
- Each ticket should be one PR in scope with enough context for an AI agent to implement independently.
- Run `/sync-standards` periodically to check for updates to shared standards from post-it.

## Builder's Lens

Think of yourself as Jesslyn's technical co-founder and principal engineer. This is a lens, not a mode to announce:

- **Quality bar**: Every recommendation should be defensible to a senior engineering team. No hobby-project energy.
- **Bias to shipping**: Help move from idea to running code. Don't over-plan. But when she's explicitly exploring or learning, match that mode.
- **Future-state thinking**: Optimize for what AI-first development will look like in a year, not what's easiest today.
- **Pattern recognition**: Notice when something connects to existing standards or conventions. Surface it when useful.
- **Capture what works**: When AI workflows produce good results, capture the pattern. When something doesn't work, capture that too.

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

# Chromacode

A VS Code theme builder with live Monaco preview, full token coverage, and JSON/extension export.

## Features

- Live Monaco editor preview across TypeScript, TSX, JSX, and CSS
- Full workbench color coverage (~60 tokens), TextMate syntax tokens, and VS Code semantic tokens
- Export as `settings.json` snippet or full VS Code extension ZIP
- Save and manage themes (requires GitHub sign-in)
- Built-in presets: Dark+, Light+, Monokai, GitHub Dark

## Stack

- Next.js 15 (App Router), TypeScript strict mode
- Tailwind CSS + shadcn/ui
- Monaco Editor (`@monaco-editor/react`)
- NextAuth.js v5 (GitHub OAuth)
- Neon Postgres + Drizzle ORM

## Development

### Option 1: Dev Container (recommended)

1. Open in VS Code with the Dev Containers extension
2. Click "Reopen in Container"
3. The container includes Node 20 and a Postgres 16 database

### Option 2: Local

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
# fill in .env.local values
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `AUTH_SECRET` | Random secret — `openssl rand -base64 32` |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |

## Scripts

```bash
npm run dev           # start dev server
npm run build         # production build
npm run lint          # ESLint
npm run typecheck     # TypeScript check
npm run test          # Vitest unit tests
npm run test:e2e      # Playwright E2E tests
npm run storybook     # Storybook dev server
npm run db:push       # push Drizzle schema to DB (runs automatically on Vercel deploy)
npm run db:studio     # Drizzle Studio GUI
```

## Deployment

Connected to Vercel — auto-deploys on push to `main`. DB schema migrations run automatically before each build.

See [CLAUDE.md](./CLAUDE.md) for full architecture and AI context.

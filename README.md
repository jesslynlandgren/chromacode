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
- Vercel Postgres + Drizzle ORM

## Local Development

### Option 1: Dev Container (recommended)

1. Open in VS Code with the Dev Containers extension
2. Click "Reopen in Container"
3. The container includes Node 20 and a Postgres 16 database

### Option 2: Local

```bash
npm install
cp .env.example .env.local
# fill in .env.local values
npm run dev
```

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `NEXTAUTH_SECRET` | Random secret for NextAuth sessions |
| `NEXTAUTH_URL` | App base URL |
| `AUTH_GITHUB_ID` | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth app client secret |
| `CHROMATIC_PROJECT_TOKEN` | Chromatic project token (CI only) |

## Scripts

```bash
npm run dev           # start dev server
npm run build         # production build
npm run lint          # ESLint
npm run typecheck     # TypeScript check
npm run test          # Vitest unit tests
npm run test:e2e      # Playwright E2E tests
npm run storybook     # Storybook dev server
npm run db:push       # push Drizzle schema to DB
npm run db:studio     # Drizzle Studio GUI
```

## Deployment

Connect the GitHub repo to Vercel. Set env vars in the Vercel dashboard. Auto-deploys on push to `main`.

# QA Standards — Personal Projects

All personal projects must meet these standards before shipping to production.
AI writes all tests. Jesslyn never writes tests manually.

---

## Coverage Requirements

- **Unit tests: 100% coverage** — enforced via coverage thresholds in vitest/jest config
- **E2E tests: every user-facing feature** — if a user can click it, there is a Playwright test for it
- No PR merges if coverage drops below 100%
- No PR merges if E2E tests fail

### Vitest Coverage Config
```ts
// vitest.config.ts
coverage: {
  provider: 'v8',
  thresholds: {
    lines: 100,
    functions: 100,
    branches: 100,
    statements: 100
  }
}
```

---

## QA Pipeline Layers

All layers run on every PR via GitHub Actions. All are required status checks.

### Layer 1 — Code Quality (~1 min)
- ESLint
- Prettier check
- TypeScript `tsc --noEmit`

### Layer 2 — Unit Tests (~2–5 min)
- Vitest (preferred) or Jest
- React Testing Library for components
- 100% coverage enforced — CI fails if below threshold

### Layer 3 — E2E Tests (~5–15 min)
- Playwright
- Tests run against Vercel preview URL
- One test per user-facing feature minimum
- Covers: happy path, error states, loading states

### Layer 4 — Visual Regression
- Chromatic (Storybook-based)
- Snapshots every component on every PR
- PR blocked until visual diff is reviewed/approved
- Free tier: 5,000 snapshots/mo

### Layer 5 — Accessibility
- axe-core embedded in Playwright tests
- Zero tolerance for a11y violations on interactive elements

### Layer 6 — Performance
- Vercel Speed Insights (automatic, zero config)
- Lighthouse CI in Actions for synthetic audits on preview URL

### Layer 7 — Security
- Dependabot: auto-PRs for vulnerable dependencies
- CodeQL: static analysis (free on public repos)

---

## CI Workflow Template

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run test:coverage
        # Fails if coverage < 100%

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
        env:
          PLAYWRIGHT_BASE_URL: ${{ env.VERCEL_PREVIEW_URL }}
```

---

## Testing Conventions

- Test files: co-located in `__tests__/` or alongside component as `*.spec.ts`
- Describe blocks: component/function name
- Test names: start with verb, describe behavior (`'renders loading state'`, `'submits form on click'`)
- Mock external APIs, never hit real endpoints in tests
- Test user-visible behavior, not implementation details
- Cover: happy path, loading state, error state, empty state, edge cases

---

## What AI Must Do When Writing Code

- Write unit tests alongside every new function/component (same PR)
- Write E2E test for any new user-facing feature (same PR)
- Verify coverage stays at 100% — if it drops, fix before opening PR
- Never open a PR that breaks existing tests

---
applyTo: "**/*.spec.ts,**/*.spec.tsx,**/__tests__/**"
---

# Testing Style Guide

These instructions apply to all test files.

## Stack

- Vitest
- React Testing Library (RTL)
- `@testing-library/user-event`

## Structure

```tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { Component } from '../Component'
import * as api from '../api'

// Mock modules at top level
vi.mock('../api')
const mockApi = vi.mocked(api)

// Mock data
const mockData = { ... }

describe('Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does something', () => { ... })
})
```

## Query Priority (RTL Best Practices)

Prefer queries in this order:

1. `getByRole` — Most accessible
2. `getByLabelText` — Form inputs
3. `getByPlaceholderText` — If no label
4. `getByText` — Non-interactive elements
5. `getByTestId` — Last resort

## Async Patterns

```tsx
// Waiting for element to appear
await waitFor(() => {
  expect(screen.getByText("Text")).toBeInTheDocument();
});

// Waiting for element to disappear
await waitFor(() => {
  expect(screen.queryByText("Loading")).not.toBeInTheDocument();
});

// User interactions with async
const user = userEvent.setup();
await user.click(screen.getByRole("button"));
await user.type(screen.getByRole("textbox"), "text");
```

## Mock Patterns

```tsx
// Mock resolved value
mockApi.fetchData.mockResolvedValue(mockData);

// Mock rejected value
mockApi.fetchData.mockRejectedValue(new Error("Failed"));

// Mock implementation (never resolves — for loading state)
mockApi.fetchData.mockImplementation(() => new Promise(() => {}));

// Spy on a function
const spy = vi.spyOn(someModule, 'someFunction');

// Mock a module with partial implementation
vi.mock('../api', () => ({
  fetchData: vi.fn(),
  updateData: vi.fn(),
}));
```

## Naming Conventions

- Describe blocks: Component name
- Test names: Start with verb, describe behavior
  - `it('renders loading state initially')`
  - `it('displays error message on failure')`
  - `it('should render')` (vague)

## Don't Test

- Implementation details
- Internal state directly
- Things covered by TypeScript
- Library internals

## Do Test

- User-visible behavior
- API call parameters
- Component output/rendering
- Error handling
- Edge cases

## Coverage Requirements

Target 100% coverage:

- All render states (loading, error, success, empty)
- All user interactions
- All API integrations

## Key Differences from Jest

If you encounter old Jest patterns, convert them:

| Jest                              | Vitest                          |
| --------------------------------- | ------------------------------- |
| `jest.mock()`                     | `vi.mock()`                     |
| `jest.fn()`                       | `vi.fn()`                       |
| `jest.spyOn()`                    | `vi.spyOn()`                    |
| `jest.clearAllMocks()`            | `vi.clearAllMocks()`            |
| `as jest.Mocked<typeof module>`   | `vi.mocked(module)`             |
| `jest.useFakeTimers()`            | `vi.useFakeTimers()`            |
| `jest.advanceTimersByTime()`      | `vi.advanceTimersByTime()`      |

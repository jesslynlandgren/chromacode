---
applyTo: "**/TICKETS.md,**/SPIKE.md"
---

# Ticket / Issue Writing Style

Jesslyn's preferences for how tasks and issues should be written — in Linear, GitHub Issues, or any task tracker. Apply when creating issues or planning work.

## General Rules

- Tickets are **implementation tasks**, not user stories. No "As a user..." format.
- Title should describe what the engineer builds: "Create UserPurchases container with API integration" not "User can view purchases"
- Flat structure under an epic — no subtasks
- Use Task type, not Story
- Draft story points (1-5 scale, 5 is max and usually means split it)

## Required Sections

### What to build
Concise implementation description. What the component does, what behavior it supports.

### Behavior to support
This is the most important section. Describe the **user-facing behavior** that should work when this ticket is delivered:
- What the user can do and what they see (e.g., "Selecting a role from the dropdown updates the permission list below it")
- Edge cases to handle: empty state, error state, loading state, permission-gated elements
- Keep it action-oriented, not code-oriented
- **Include exact copy** for all user-facing text: toast messages, modal headings, button labels, descriptions, error messages. Don't paraphrase — provide the actual string.
- For each UI element, clarify what's a **functional requirement** (must have a way to create a role) vs what's a **UI detail** the engineer should decide (where the create button goes)
- Reference the spike or design doc for detailed existing behavior — don't duplicate it in the ticket

### Endpoints
Table of API calls with method, path, purpose. Note which are reusable from existing code (with file paths). Include request/response shape if non-obvious.

### Implementation notes
- Which **pre-existing** shared hooks/components to reuse (with file paths) — only things that already exist, not code that this ticket would create
- Link to similar completed work as a pattern reference
- Known gotchas or resolved questions from the spike
- Do NOT prescribe exact file names, component names, or directory structure for new code — the engineer decides that at implementation time

## Sizing

| Points | Meaning |
| --- | --- |
| 1 | Single component, no API, simple render |
| 2 | Component + API, or moderate interaction |
| 3 | Multiple components, API, some state |
| 4 | Complex — multiple components, context/state, several APIs |
| 5 | Max. Flag and suggest splitting. |

## What NOT to Do

- Don't write vague tickets ("Implement the page") — break it down
- Don't separate tests into their own tickets — tests ship with the code
- Don't make tickets by technical layer ("create types", "create API file") — group by UI area
- Don't assume existing behavior — verify it in the code and reference the source
- Don't retell code tracing in tickets — that belongs in the spike. Tickets describe what to build and what behavior to support.
- Don't prescribe feature flag names — reference the project's flag naming convention
- Don't reference code that would be created by the ticket — only reference pre-existing shared infrastructure

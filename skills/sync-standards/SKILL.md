---
name: sync-standards
description: "Check post-it repo template for updates and guide applying them to this project repo."
---

# Sync Standards

Compare this repo's shared files against the latest template in `jesslynlandgren/post-it` and guide Jesslyn through adopting changes.

## When to Run

- Periodically (CLAUDE.md suggests running this occasionally)
- When Jesslyn says "sync standards" or "check for updates"
- After a major post-it standards overhaul

## Workflow

### 1. Fetch the template

Read the following files from `jesslynlandgren/post-it` via GitHub MCP (or local filesystem if available):

- `templates/repo-template/CLAUDE.md`
- `templates/repo-template/standards/*.md`
- `templates/repo-template/skills/fix/SKILL.md`
- `templates/repo-template/skills/modifiers/SKILL.md`
- `templates/repo-template/.claude/rules/*.md`

### 2. Diff against local

For each file, compare the template version against this repo's version. Look for:

- **New rules or sections** added to the template that this repo doesn't have
- **Changed rules** where the template wording has been updated
- **New files** in the template that this repo is missing entirely

Ignore:
- Project-specific sections (stack table, key files, conventions, gotchas)
- The `{placeholder}` markers in the template — those are fill-in-the-blank

### 3. Present changes

For each difference found, show Jesslyn:
- What changed in the template
- What the current version in this repo says
- A recommended action (add, update, skip)

**One change at a time.** Don't dump a list.

### 4. Apply approved changes

For each change Jesslyn approves, make the edit. For changes she skips, move on.

### 5. Commit

If any changes were made, commit with:
```
chore: sync shared standards from post-it template
```

## Rules

- **Never overwrite project-specific content.** Only touch shared sections (About Jesslyn, Key Rules, Quality Standards, Builder's Lens, standards/ files).
- **Show the diff, don't auto-apply.** Jesslyn decides what gets adopted.
- **One change at a time.** Interactive, not batch.

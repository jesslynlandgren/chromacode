---
name: fix
description: "Analyze a problem Jesslyn described in conversation and make systemic improvements to CLAUDE.md, skills, and standards. Triggers: /fix, fix yourself, improve yourself, learn from this."
---

# Fix — Systemic Self-Improvement

Jesslyn has identified a problem with how you're operating. Your job is to trace it to root causes in your instruction files and fix them — not just acknowledge the feedback.

## Workflow

### Step 1: Identify the problem

Read back through the recent conversation. Find:
- What Jesslyn said was wrong (the symptom)
- What she expected instead (the desired behavior)
- Why it matters (the impact)

State these back to her in 2-3 sentences. Don't over-explain. Get confirmation before proceeding.

### Step 2: Root cause analysis

Trace the problem through your instruction stack. For each layer, check whether it caused, enabled, or failed to prevent the problem:

1. **CLAUDE.md** — Is there a rule that should have prevented this? Is there a rule that caused it? Is a rule missing?
2. **skills/*/SKILL.md** — Does any skill have a step that directly contradicts the desired behavior? Does any skill fail to include a step that would have caught it?
3. **standards/*.md** — Does a standard guide behavior that led to the problem? Is a standard missing or incomplete?
4. **templates/*.md** — Does a template propagate the problem to new projects?

For each finding, note: the file, the specific line/section, what's wrong, and what the fix is.

### Step 3: Propose changes

Present ALL proposed changes as a numbered list before making any edits:

```
1. CLAUDE.md rule 3 — add "never auto-add tasks" clause
2. skills/plan-project/SKILL.md step 4 — change wording to match actual approach
3. standards/dev-workflow.md — remove outdated Copilot reference
```

Wait for Jesslyn to approve, modify, or reject. She may see connections you missed or disagree with a fix.

### Step 4: Apply changes

Make all approved edits. Prioritize in this order:
1. **CLAUDE.md** — highest impact, read by every tool and session
2. **Standards** — referenced by every project repo
3. **Skill files** — governs specific workflows
4. **Templates** — propagates to new projects

### Step 5: Verify

After applying, re-read the problem statement from Step 1. Walk through the instruction stack again and confirm the fix would actually prevent the problem if it happened again. If there's a gap, flag it.

### Step 6: Propagate

Grep for the old/wrong pattern across the entire repo. Fix every occurrence — not just the file you're looking at. Stale values in other files will resurface in future sessions.

### Step 7: Commit

Commit with a message that describes what behavioral change was made and why.

---

## Principles

- **Standards and rules change behavior. Acknowledgment doesn't.** If you only say "I'll remember that," you haven't fixed anything. Change the instruction files.
- **Trace, don't patch.** Don't just add a rule for the specific symptom. Find the instruction that caused the wrong behavior and fix it at the source.
- **Show your work.** Jesslyn wants to see the reasoning, not just the diff. The analysis matters as much as the fix.
- **One conversation, full fix.** Find it, propose it, fix it, commit it — all in one go.
- **Propagate repo-wide.** When you fix something, grep for the old value everywhere. One stale reference undoes the fix.

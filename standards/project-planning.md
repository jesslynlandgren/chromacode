# Project Planning — How Jesslyn Works

How ideas become projects, how projects get planned, and how work gets sequenced.

## The Lifecycle

```
IDEA → VISION → JOBS → STRESS-TEST → SEQUENCE → HARDEN → TICKETS
```

Not every step is formal. Early stages are conversational. Later stages produce artifacts.

## Stages

### 1. Idea

A loose concept. Might be one sentence, a screenshot, a "what if I built..." thought. Lives in `ideas/` as a markdown file — can be as rough as a paragraph or as detailed as a product comparison.

No evaluation framework. No scoring rubric. Jesslyn brainstorms it until she either loses interest or decides it's worth building.

### 2. Vision

The idea has legs. Jesslyn describes what the product does, who it's for, and what it feels like to use. This is exploratory — getting more particular over time, not writing a formal spec up front.

**Claude's job here:** Be a thinking partner. Ask questions that sharpen the vision. Don't rush to user stories or technical architecture. Match the exploratory energy.

### 3. User Jobs

Define the specific jobs users need to accomplish. Not "as a user, I can..." stories — actual jobs. "Upload a CSV and see a preview." "Switch between light and dark theme variants." "Export a finished theme as a VS Code extension."

**Claude's job here:** Help be exhaustive. What jobs are missing? What about first-time vs. returning users? What about error recovery?

### 4. Stress-Test

Poke holes in the plan. How do flows interact? What are the edge cases? What questions haven't been answered yet?

**Claude's job here:** Be the skeptic. Think about what breaks. Find the gaps in the user jobs. Surface contradictions. Be exhaustive about unanswered questions — but present them one at a time, not as a wall of text.

### 5. Sequence

Order the work smartly. Consider:
- What has to exist before other things can be built?
- What's the smallest useful increment?
- What unblocks the most future work?
- What's risky or uncertain (do that earlier to learn)?

The sequence is a rough ordering, not a rigid plan. It can change as you learn.

### 6. Harden

For the **upcoming** batch of work only (not the whole backlog), write detailed requirements:
- Specific acceptance criteria
- File paths, component names, API shapes
- Edge cases and error states to handle
- What "done" looks like

**Only harden work that's about to be picked up.** Future work stays loose — it will change as you learn from building.

### 7. Tickets

Write Linear issues from the hardened requirements. Each ticket should:
- Be one PR in scope
- Have enough context for an AI agent to implement without asking questions
- Reference the repo's CLAUDE.md and relevant standards
- Include file paths and component names when known
- Follow the conventions in `standards/ticket-writing.md`

See `standards/ticket-writing.md` for ticket format.

## What This is NOT

- **Not waterfall.** You don't write all the specs up front. You iterate.
- **Not user stories.** "As a user, I can..." is a format, not a planning methodology. Describe actual jobs.
- **Not all-or-nothing.** A project can sit at the "vision" stage for weeks. There's no pressure to move through stages linearly.
- **Not separate from building.** You'll learn things during implementation that change the plan. That's expected.

## Where Artifacts Live

| Artifact | Location |
|---|---|
| Rough ideas | `ideas/{name}.md` |
| Active project planning | `projects/{name}/` |
| Product spec (when it exists) | `projects/{name}/SPEC.md` |
| SDLC plan | `projects/{name}/SDLC.md` |
| Sequenced work | Linear (project view) |
| Hardened tickets | Linear (individual issues) |
| Project registry | `projects/README.md` |

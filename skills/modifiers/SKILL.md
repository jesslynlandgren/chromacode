# Modifier Skills

Utility modes that change how the AI approaches a conversation. These are stateless — they modify behavior for the current interaction, not the repo.

---

## /brainstorm

Divergent thinking mode. Generate lots of ideas without judgment.

**Behavior:**
- Quantity over quality — get ideas flowing
- No filtering, no "but actually" during brainstorm phase
- Group ideas by theme if the list gets long
- When Jesslyn says "ok narrow it down" or similar, switch to evaluative mode
- One idea or theme at a time if she wants to go deep on any

---

## /research

Thorough investigation mode. Local files first, then web.

**Behavior:**
- Start by searching the repo (standards/, research/, projects/) for existing knowledge
- Then search the web for current information
- Synthesize findings — don't just dump links
- Flag confidence level: "confirmed", "likely based on X", "uncertain"
- Cite sources (file paths, URLs)
- **Always save findings** to `research/research-{topic}-{YYYY-MM-DD}.md`

---

## /deep-dive

Go deep on a single topic. Exhaust what can be learned.

**Behavior:**
- Longer output is acceptable — this is the one mode where depth beats brevity
- Follow threads to their conclusion
- Connect findings to existing knowledge in the repo
- Organize with clear sections and headers
- Save output to `research/` if the findings have lasting value

---

## /compare

Side-by-side evaluation of options.

**Behavior:**
- Structured comparison table with criteria, scores, trade-offs
- Lead with a recommendation — don't just present options neutrally
- Explain what criteria matter most for this specific decision
- Include a "Jesslyn should pick X because..." summary at the end
- If the comparison involves tools, verify they're still maintained (web search)

---

## /draft

Speed over polish. Get ideas down fast.

**Behavior:**
- Write quickly, mark rough spots with `[TODO]` or `[REFINE]`
- Don't agonize over wording — capture the core idea
- Structure matters (headers, bullets) but prose quality doesn't yet
- When done, offer to run `/polish` on the result

---

## /polish

Refine existing content. Preserve voice, tighten language.

**Behavior:**
- Read the existing content first — understand the voice and intent
- Tighten language without changing meaning
- Fix inconsistencies, awkward phrasing, redundancy
- Preserve Jesslyn's casual voice (don't make it corporate)
- Show a diff or call out what changed and why

---

## /summarize

Extreme brevity. 3-5 bullets max.

**Behavior:**
- Lead with the most important point
- Each bullet is one complete thought
- No filler, no context-setting, no "In summary..."
- If the source material has nuance that gets lost, add one line: "Nuance lost: {what}"

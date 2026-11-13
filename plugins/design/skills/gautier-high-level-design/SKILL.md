---
name: gautier-high-level-design
description: High-level technical design session for a scope, one decision at a time.
disable-model-invocation: true
---

# Gautier high-level design

Agree with the user on the few design decisions that matter before implementation: the main decomposition, boundaries and contracts, so the code stays reviewable, changeable and testable part by part. Discuss in chat; record only what is decided in a Markdown design document. This session produces a design, not application code or implementation tasks.

## Workflow

1. **Agree what to build, in chat.** Cover intent, scope, constraints and acceptance criteria only. Close with a short "What we want to build" summary and get the user's confirmation. If the request is already clear, restate it and confirm in one message.
2. **Ask for the user's design ideas.** Treat them as a starting point, not an exhaustive list.
3. **List the topics.** Inspect relevant existing code, then create `docs/features/<YYYY-MM-DD>-<feature-name>.md` with front matter `parent: null`, `status: designing` and a one-line `description`, then the summary and a topics table: topic, why it matters, status (`to discuss`, `discussing`, `decided`, `implementer's call`). Order by dependency, top-level modules and interactions first. The user triages which topics to discuss. Add topics that come up later and let the user triage them.
4. **One topic at a time.** Discuss in chat; propose one coherent design, with alternatives only for meaningful tradeoffs. Once decided, add the decision's section and mark the row `decided`; the user reviews that section before the next topic. If a decision changes an earlier one, edit the earlier section.
5. **Close.** Ask whether any decision deserves an ADR, with a recommendation, and write the approved ones following the repository's convention. Remove the topics table and set `status: designed`. Status values: `designing`, `designed`, `implementing`, `done`; the implementer sets the last two.

## Sub-designs

When a topic is too large to settle in one section, propose a sub-design; the user decides. Run the same process on it, by default in the same chat (suggest a new session if it is large):

- Create `docs/features/<YYYY-MM-DD>-<sub-name>.md` and the same front matter, except `parent: "[[<parent-doc>]]"`. Draft its "What we want to build" from the parent's context and get a quick confirmation instead of a full step 1.
- In the parent, set the topic's status to `sub-design` with a link to the child; continue independent topics.
- When the child closes (with its own ADR offer and "Implementation deviations" section), write the parent's section in one or two lines plus the link: only the child's contract and interactions the parent relies on. Mark the row `decided`.

Sub-designs can nest.

## What to design

Spot the topics that matter: the top-level modules and their interactions, the parts that are hard to reverse, and the main failure modes. Go only as deep as a decision requires; leave the rest to the implementer. Organize modules around domain concepts, not technical layers (for infrastructure or library work the domain is technical). Silently give high-value or risky logic its own module so tests can target it in isolation. Distinguish evidence, assumptions and proposals. When discussion drifts below the design level, record it as an implementation note in the related section.

## Decision sections

Record only what was decided, not the alternatives discussed. Each section has at least one Mermaid diagram, unless nothing decided can be pictured; split rather than crowd. Pick the diagram type that best fits each topic from the full [diagram catalog](references/diagram-selection.md) (C4, architecture, block, flowchart, sequence, state, class, ER, event modeling, and others); the examples here are not a closed list. Use Mermaid diagrams in chat too when proposing a design for a topic. Add short text: the decision, why, and how to implement it. Use pseudocode only where its shape matters, showing intent rather than code to copy.

End the document with an "Implementation deviations" section containing: "Use your best judgment; do not stop to ask. If you break an agreed decision, record here what you changed, why, the decision you took and its rationale."

The user checks diagrams in their Markdown preview. To debug one that fails to render, extract it to a `.mmd` file and run `npm exec --yes --package=@mermaid-js/mermaid-cli -- mmdc -i <file>.mmd -o <file>.svg`.

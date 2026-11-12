---
name: gautier-design-slice
description: Collaboratively plan a feature into design rounds, or design a specific round and agree its atomic implementation tasks. Routes feature ideas and READMEs to slice planning, and round document paths to prerequisite-gated round design. Produces Markdown designs, not application implementation.
---

# Gautier design slice

One entry point for two design workflows. Choose from the user's request and existing artifacts, not an assumed project phase.

| Input / intent | Workflow to read |
| --- | --- |
| New feature idea; plan or reshape a feature; feature README path | [Plan a slice](references/plan-slice.md) |
| Specific round path (including `R2.1-<subject>.md`); continue a clearly identified round | [Design a round](references/design-round.md) |
| Ambiguous continuation, multiple candidate documents or conflicting intent | Ask one focused question identifying the intended workflow/document |

A plain feature README path selects slice planning unless the user explicitly identifies a round to design.
A task path is not an implementation request handled by this skill; identify its linked round and clarify the intended design change.
Read the selected workflow, its artifact contract and the [local Markdown review app guide](references/review-app.md).

**On every invocation, automatically start or resume the Node.js review app and open its URL before the first design question.**
Serve the selected feature README for planning or the selected round Markdown for round design.
If the target is ambiguous, resolve it first. For a new idea with no README yet, open a temporary Markdown draft with the
developer's feature idea. Create the repository artifacts at the planning workflow's usual agreement point.
Follow the guide's feedback loop throughout the review. If the browser cannot open automatically, share the live link.

Both workflows use [the artifact contract](references/artifact-contract.md) for IDs, metadata, relative wiki links,
dependency gates, task files, review propagation and required/deferred refactors.
The workflows include Mermaid process diagrams for human review and invoke `mermaid-diagrams` for design diagrams.

Reuse prior explicit agreements rather than restarting interviews. Preserve existing artifacts on re-entry.
Planning ends after the agreed README and all metadata-only round stubs exist; it does not automatically begin round design.
Round design starts only when all recursive prerequisite designs are done and clear of review requirements.
Large rounds may be split into agreed sub-rounds; the hierarchy describes context, while `depends_on` controls readiness.
Task breakdown includes a developer-agreed `executor: human` or `executor: agent`.
Leaf design ends after design and assigned atomic tasks are agreed and validated; a group completes after its agreed children are done.
`done` here means design/decomposition complete, not implementation complete.

Use the repository's feature location, defaulting to `docs/features/<feature-slug>/`.
Inspect its shared refactor backlog for relevant dependencies; record deferred work once with a concrete revisit trigger.
Neither workflow authorizes application-code changes, test execution beyond document/diagram checks, commits or external publishing.

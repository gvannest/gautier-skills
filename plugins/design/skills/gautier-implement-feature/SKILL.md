---
name: gautier-implement-feature
description: Implement a feature, component or other piece of work autonomously, split into tasks with one tested commit each, then report back.
disable-model-invocation: true
---

# Gautier implement feature

- Follow the `engineering-design` skill's principles.
- Split the work into tasks. Each task gets its own tests, and one commit once the tests, lint and typecheck pass.
- Use your best judgment for decisions; don't stop to ask. Before each significant decision, name the discipline it belongs to (e.g. security, concurrency, API design, data modeling, UX), recall the established best practices an expert in that field would apply, then decide. Note each one for the report.

## Final report

End with a concise report:

1. **Implemented:** what was built, per commit.
2. **Decisions:** significant choices you made alone, the discipline and best practice behind each, and why.
3. **Architecture:** a Mermaid diagram of what was added or changed.
4. **Friction:** problems hit, what slowed you down, what you wish you had known to work faster and use fewer tokens.
5. **Doc conflicts:** contradictions or discrepancies found in the instructions you read (skills, AGENTS.md, CLAUDE.md, project docs), with file paths and how you resolved each one.
6. **Blocked access:** hosts or resources you tried to reach and couldn't (documentation, APIs, packages), and what you needed from them.
7. **Gates:** deterministic checks (tests, lint rules, type constraints, CI, hooks) that would stop the codebase and its functional and non-functional requirements from degrading.

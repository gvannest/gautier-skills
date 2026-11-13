---
name: gautier-implement-design
description: Implement an agreed design document.
disable-model-invocation: true
---

# Gautier implement design

- Implement the design in the document whose path the user provided; if none was provided, ask for it.
- When you start, set `status: implementing` in the design document's front matter.
- First define an implementation plan, then implement. One commit per phase of the plan.
- Use your best judgment for decisions not covered by the design document. If you break an agreed decision, record it in the document's "Implementation deviations" section.
- Use test-driven development.
- When done, set `status: done` in the design document's front matter.

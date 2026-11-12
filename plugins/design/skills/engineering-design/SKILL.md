---
name: engineering-design
description: Use when designing the technical solution or architecture of a feature, bug fix, or refactoring.
---

# Engineering design

Scale the design discussion to the change.

## Design principles

- **KISS and YAGNI:** Choose the smallest maintainable solution. Justify added complexity against the simpler option.
  Prefer the language's standard library; add dependencies only for a proven need.
- **DDD and vertical slices:** Read the project's domain vocabulary, context map, and relevant responsibility documentation.
  Create any missing `CONTEXT_MAP`, `BOUNDED_CONTEXT`, or `UBIQUITOUS_LANGUAGE` documents, following the project's naming
  and location conventions. Capture context relationships, each relevant context's responsibilities, and shared domain terms.
  Maintain vocabulary and context relationships.
  Model use cases as vertical slices within their bounded context; a context can own several slices.
- **Command/query separation:** Separate state-changing commands from information-returning queries in the codebase.
  Queries return information without side effects: they do not mutate state, enqueue work, publish events or trigger actions.
  Commands change state and return no information by default, apart from indicating success or failure.
  Returning information from a command, such as a newly created identifier alongside success, is an exception.
  Justify each exception for the specific use case, document it in the design and public contract, and return only what is needed.
  Prefer a separate query for business information or read models rather than adding them to a command's result for convenience.
  A command that returns information remains a command; flag the mixed behavior explicitly during design review.
- **Business cohesion:** Group by responsibility and reasons to change, then split technically only for clarity.
  Keep code that changes together close together.
- **Deep modules:** Hide real complexity behind shallow public APIs. Keep simple code at its parent level; extract a
  module for a cohesive domain responsibility. Hide implementation decisions and state; enforce invariants in their owner.
  Add interfaces only at real boundaries; minimize shared knowledge across expensive boundaries.
- **Functional core:** Keep domain rules, policies, and algorithms pure, using explicit domain types where supported.
  Put I/O and side effects in adapters or the imperative shell.
- **Context boundaries:** Expose public contracts and keep dependencies between contexts explicit and controlled.
  Distinguish supporting modules from business contexts. Document each context's business question, vocabulary,
  responsibilities, and reasons to change using the project's conventions.
- **Data boundaries:** Where applicable, preserve immutable source data, auditable and idempotent imports, reconciliation,
  and tenant isolation. Map storage records and external payloads through adapter/service contracts into independent
  consumer models.
- **Tracer bullets:** For large features, start with the thinnest valuable vertical slice crossing the relevant layers.

## Verification alongside design

Read the project's testing guidance and suite documentation before design changes.
Sketch public test seams before testing; reuse existing seams and exact coverage before adding proof.
Test observable behaviour with only necessary collaborators/infrastructure:

- Unit: deep module's shallow API and collaborating pure components; extract a child module for independently complex logic.
- Integration: external adapters with controlled dependencies or mock provider servers.
- E2E: complete workflow entry point, real controlled infrastructure, mocked providers.
- Property: meaningful pure invariants or input breadth beyond examples.

End each design discussion with one consolidated checklist, carrying forward relevant earlier requirements. Keep it in
the design document when one exists. Cover:

- [ ] Observable behaviours and invariants, with public test seams and expected results.
- [ ] Queries leave state unchanged and trigger no actions; commands return only success/failure unless an exception is justified.
      Cover the minimal result and failure behavior of each documented command-return exception through its public contract.
- [ ] Relevant boundary cases, invalid inputs, and failure scenarios.
- [ ] Applicable data-integrity, idempotency, reconciliation, and tenant-isolation guarantees.
- [ ] Existing proof reused, remaining gaps, and the least costly tests that establish each guarantee.

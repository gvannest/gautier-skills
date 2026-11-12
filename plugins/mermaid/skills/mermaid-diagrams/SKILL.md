---
name: mermaid-diagrams
description: >-
  Use when the user asks to create, edit, review, or choose a diagram, including requests to visualize a process,
  system, architecture, lifecycle, data model, timeline, or comparison, even without mentioning Mermaid.
  Also use when explicitly invoked as $mermaid-diagrams.
---

# Mermaid diagrams

Choose notation by the question the reader needs answered. Use Mermaid by default when the user has not specified a tool or format.
Respect an explicit choice such as PlantUML, BPMN, or Figma; apply the selection principles without changing the requested tool.

## Establish the purpose

Use the conversation and available source material to identify the audience, question, scope, and facts to show.
For a real system, inspect relevant code, docs, and existing diagrams before representing its components, boundaries, or behaviour.
Find discoverable facts yourself. Every component, boundary, protocol, datastore, deployment location, and interaction needs a source.

If missing information could change the diagram type or materially change its content, ask a short, targeted question and wait
for the answer before drawing the affected view. Offer two or three concrete choices when that makes answering easier.
For example: "Should this explain the system's components, the order of calls, or an import's lifecycle?"
Ask about audience, current versus proposed state, or scope only when these affect the result and are not already established.
When the purpose and facts are clear, proceed to selection without another interview.

## Select the view

Read [the selection catalog](references/diagram-selection.md) when choosing a type or explaining alternatives.
It covers each documented type, when to use it, when to avoid it, and its official syntax link.

Common choices:

- Components, dependencies, decisions, or data flow: flowchart; use explicit boundaries for architecture views.
- Calls, responses, retries, and interaction order: sequence.
- An entity's states and allowed transitions: state.
- Entities and relationship cardinalities: ER.
- Process ownership and handoffs: swimlanes.
- Scheduled tasks, durations, and dependencies: Gantt; dated events without durations: timeline.

State the chosen type and the question it answers in one sentence. If the user requested a type that obscures the purpose,
explain the tradeoff and offer a suitable alternative; preserve their explicit choice unless they agree to change it.
Prefer one focused view; split distinct questions, audiences, or abstraction levels into separate diagrams.
Use prose or a table if it communicates the information more clearly than a diagram, and explain that recommendation.
For selection advice alone, stop after explaining the recommendation.

## Check syntax

Open the selected type's official documentation when syntax, capabilities, or compatibility are uncertain.
For newer or beta types, check both the current documentation and the destination's Mermaid version before relying on them.
The catalog is a selection aid, not a frozen compatibility promise; consult the
[current catalog](https://mermaid.js.org/intro/) for additions and changed status.
If the renderer is unknown, favor established syntax where it meets the need and disclose any remaining compatibility uncertainty.

## Produce

For a software architecture or system-behaviour diagram, follow [architecture production](references/architecture-diagrams.md)
instead of this section: it owns confirmation, delegation, composition, legends, artifacts, validation, and iteration.

Otherwise: use concise labels and consistent arrow meanings. Show boundaries and legends when they convey meaning that labels alone cannot.
Introduce each diagram with its purpose and explain its key takeaway. Put Mermaid chat diagrams in fenced `mermaid` blocks.
For file deliverables, follow the project's artifact conventions and keep editable Mermaid source available.
When practical, parse-render the exact final source:

```sh
npm exec --yes --package=@mermaid-js/mermaid-cli -- mmdc -i path/to/diagram.mmd -o /private/tmp/diagram.svg
```

Report validation accurately: distinguish a successful render from source-only review and disclose rendering failures.

## Completion checks

- The view answers the intended question for its audience; material ambiguity is resolved.
- The selected type's semantics fit the facts; components, transitions, and numerical values have a source.
- Explicit format choices and destination compatibility constraints are respected.
- Relationships, boundaries, labels, and any units or time periods are understandable.
- Editable source is supplied as requested, and validation status is accurate.

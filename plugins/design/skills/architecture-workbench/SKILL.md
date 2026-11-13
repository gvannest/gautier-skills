---
name: architecture-workbench
description: "Build or improve an interactive architecture explorer for a codebase: nested modules and use cases, dependencies, execution flows, data models, source evidence and review notes."
disable-model-invocation: true
---

# Architecture workbench

Build a working application for understanding and assessing a project's architecture without repeatedly reading its source.
Reproduce the interaction contract in this skill; adapt implementation and architectural vocabulary to the target project.
Use the project's existing capabilities and conventions for the explorer implementation.
The local workspace and package commands below are standard; they do not prescribe the explorer's implementation stack.

## Product contract

Choose the requested scope: **application**, **bounded context**, or **use case**. Support direct entry at each level.
The exploration funnel is application → bounded context → use case, with separate linked detail views.
Application scope has three coordinated overview views:

- **Module map:** stable business boundaries, focused incoming/outgoing dependencies and expansion inside each parent.
- **Dependency matrix:** rows depend on columns; cells open the same facts and review records as the map.
- **System context:** users, external systems, application boundaries, processes and infrastructure, with nested exploration.

Bounded-context scope opens one expanded business boundary and its directly connected external neighbors.
Use-case scope has separate **Dependencies**, **Execution flow**, and **Data model** pages or tabs.
Read [Scoped funnel and use-case detail](references/scoped-funnel.md) for scope, navigation, sequence and schema requirements.
That contract specializes the overview interface; a scoped request does not require an application-wide matrix or system diagram.

Commands and queries represent behavior. Data objects represent information that behavior accesses.
Dependency arrows point **dependent → dependency** across dependency views and levels of detail.
Sequence messages express interactions over time; schema links express data relationships. Give each view its own explicit legend.
The artifact supports architectural judgment; structural coupling alone does not prove a dependency is unjustified.
A command returning information receives an evidence-backed warning; assessment and refactoring decisions remain explicit user judgments.

Read [Interface contract](references/interface-contract.md) before implementing the views.
Read [Evidence model](references/evidence-model.md) before collecting or projecting architecture facts.
Read [Verification scenarios](references/verification-scenarios.md) when planning proof and before delivery.
Read [Local workspace and lifecycle](references/local-runtime.md) before choosing the application location or launcher.
These references are the reproducibility specification, not optional enhancement ideas.

## 1. Establish scope from the project

Identify the repository or application, applicable local instructions, available source and architecture documentation.
Inspect existing artifacts before replacing them. Preserve useful behavior and user review records during updates.
Use project discovery capabilities when available, then inspect the relevant source to resolve uncertain matches.
A shared name or similarly named method is not sufficient proof of a call relationship.

Record the requested root, source snapshot, discovery coverage and scope boundary before collecting facts.
For a scoped request, inspect that root deeply and trace its direct incoming/outgoing boundary connections.
Discover reverse callers outside it without recursively inventorying the entire application.
Determine the relevant business modules, public contracts, entry points, processes, storage boundaries and external dependencies.
Use bounded-context vocabulary where the project supports it. Otherwise label cohesive modules without inventing domain boundaries.
Represent the number and vocabulary of modules established by this project's evidence.
When a migration is in scope, distinguish retained, migrated and planned elements using evidence from that project.

Completion: an evidence-backed inventory and a clear statement of what source or runtime coverage is unavailable.
Ask only for information that materially blocks this inventory or changes the requested deliverable.

## 2. Build a portable architecture inventory

Record stable identities separately from display names, layout and review notes.
Keep node hierarchy, dependency facts, source evidence and derived display connections separate.
Use [Evidence model](references/evidence-model.md) to preserve exact callers, targets, dependency kinds and uncertainty.

Inspect implemented use cases within each business boundary. Map them to entry points and implementation locations.
Classify state-changing behavior as **command**, even if it returns information; classify read-only behavior as **query**.
When a command also returns information, show a warning and explain the state change, returned information and source evidence.
Distinguish business data from a receipt, acknowledgment or identifier in that explanation; do not silently exempt either form.
Keep the observed command classification while flagging the command/query separation concern for review.
Use an explicit unknown classification or unknown return behavior when evidence is insufficient.
Write a specific, one-sentence description for each use case, available on hover and keyboard focus.
Identify infrastructure that calls business behavior as well as business behavior that uses infrastructure.
Record each real direction separately, distinguishing a supplied callback from a direct implementation dependency.

Group data references only where grouping improves readability. Give groups concrete labels such as “Billing data objects.”
Expose verified named objects and their actual consumers. Mark inferred grouping separately from established ownership.
Retain unresolved aggregate dependencies at group level; expanding a group must not invent object-level arrows.

Completion: visible facts can be traced to evidence, and inferred or unresolved claims are explicitly distinguishable.

## 3. Build the focused explorer

Keep the application in `.local/architecture-workbench/` inside the repository's persistent main checkout, not a temporary worktree.
Resolve that checkout before creating files, and verify that Git ignores the application there.
Include a private `package.json` with `npm start`, `npm stop` and `npm run status`, following the local lifecycle contract.
Keep these generated application files local; publishing them requires an explicit user request.
Implement the [Interface contract](references/interface-contract.md) for the chosen scope using available project capabilities.
Apply [Scoped funnel and use-case detail](references/scoped-funnel.md) for linked dependencies, sequences and detailed data models.
Keep each diagram on its own page or tab; preserve selection, filters, scenario and viewport when navigating back.
In application mode, default to a compact module map with business coupling visible and physical storage as an optional layer.
In bounded-context mode, show all implemented commands/queries inside the selected context and compact direct external neighbors.
Selecting a module changes emphasis and connections without rearranging module positions.
Expanding reveals involved use cases or data objects inside their owning parent; selecting one narrows the trace further.
Keep peers in the selected scope visible and reachable, with readable labels at ordinary viewing scale.
Provide an **All use cases** disclosure so implemented behavior remains discoverable without mapped relationships or enabled layers.

Provide an inspector shared by map and matrix selection, with dependency meaning, exact use cases, evidence and review notes.
Review states are **unreviewed, justified, investigate, refactor**. Store a rationale separately from observed architecture facts.
Persist reviews between sessions and provide a portable export with snapshot and stable canonical assessment-boundary identities.
A review action changes analysis records, not application source or architecture evidence.

Keep business boundaries separate from execution topology. A module used by several processes remains one business module.
Show process-to-use-case entry relationships rather than hiding all business modules inside one process.

Completion: users can move down the funnel, switch use-case detail views, trace a step to its tables/columns and back,
and return to the parent without losing orientation, evidence or review identity.

## 4. Verify and deliver the running artifact

Exercise [Verification scenarios](references/verification-scenarios.md) at the responsible seams.
Verify the start/stop/status and ignore guarantees in [Local workspace and lifecycle](references/local-runtime.md).
Reuse valid existing checks and add proof for new guarantees. Verify browser interactions through real user input where available.
The gesture regression is essential: dragging inside a large expanded boundary or over a node pans without activating it.
A normal click and keyboard activation still work afterward.

Open the working artifact in the user's available preview surface when supported.
Leave it in a readable, relevant state, rather than a graph shrunk until every label is illegible.
Report how to explore it, start and stop it, what was verified, where review notes persist, and the evidence limits.
If a preview capability is unavailable, provide the runnable artifact and exact project-appropriate launch instructions.
Do not substitute a screenshot, design document or static diagram for the requested working application.

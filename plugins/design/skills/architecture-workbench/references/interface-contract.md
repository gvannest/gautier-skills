# Interface contract

Use these behavior and presentation requirements to recreate the workbench across projects.
Preserve explicit user preferences when adapting an existing application.
Use the [Annotated wireframe](annotated-wireframe.md) for orientation; it is illustrative, while this contract is normative.

## Scope and navigation

Apply [Scoped funnel and use-case detail](scoped-funnel.md) for bounded-context and use-case requests.
The application-wide shell and matrix below apply to application scope; scoped pages show only their relevant navigation.
Preserve the common evidence, review, accessible interaction and dependency semantics in every mode.

## Shell and visual hierarchy

- Header: project identity, architecture snapshot, **Module map**, **Dependency matrix**, **System context**, **Export reviews**.
- Selection toolbar: active module or trace, incoming/outgoing connection counts, **Overview**, **Back to module**, **Collapse all**.
- Layer controls: calls, supplied callbacks, implementation imports/references, shared-data access and physical storage access.
  Provide infrastructure and composition controls separately. Explain which facts are filtered out.
- Workspace: readable map or matrix, with an inspector opened by a connection or detailed item selection.
- Footer: discovered business-module count, visible supporting-module count, command/query legend and review progress.

Use a quiet light canvas, strong module titles, thin boundary outlines and generous spacing for connectors.
Distinguish commands, queries, infrastructure and data objects by text labels as well as appearance.
Use restrained accents: blue for ordinary dependencies, a contrasting accent for incoming focus, warm tones for data coupling,
muted violet for infrastructure, warm command badges and green query badges. Keep unrelated module names legible when de-emphasized.

Favor a stable grid or anchored layout, with columns adapted to available width and module count; a single-module project may use one column.
Expanded content may grow its row; preserve peer order and column assignment. Selection itself must not move modules.
Use normal-size readable labels and scrolling rather than defaulting to a miniature fit-everything graph.
On narrow surfaces, make the inspector dismissible and keep navigation reachable. Tables may scroll independently.

## Module map

The map shows business modules as primary cards and supporting or external elements as a distinct category.
Each business card includes:

- Module name and classification, plus a concise responsibility description.
- Incoming and outgoing mapped-fact counts, explicitly distinguished from connection counts and runtime traffic volume.
- A dedicated expand/collapse affordance, independent of selecting the module.
- Expanded use cases contained inside the parent card, with **C** command and **Q** query badges.
- Expandable data groups when relevant, separate from the behavior list.

Start with modules collapsed and a useful module focused, or a compact overview if no focus is evident.
Selecting a module keeps all peers in place, emphasizes that module and its neighbors, and shows only incident connections.
Overview restores aggregate inter-module relationships. Collapse all closes disclosures without discarding review records.
Aggregate facts into one directed connection per visible module pair, retaining every fact and dependency kind in its inspector.
Reciprocal dependencies use separate arrow directions. Do not imply that the reciprocal pair uses the same mechanism.

Route connectors through whitespace rather than across titles or descriptions. Keep count badges separate and selectable.
Arrow badges show mapped-fact counts; detailed action labels belong in the inspector or focused trace.
Use arrowheads to communicate direction, distinct line styles for indirect callbacks/references, and a visible legend.

Expanding a module reveals use cases involved in the visible connections and states how many of its total use cases are shown.
Always provide **All use cases**, including implemented operations with no mapped dependencies and those excluded by current filters.
Distinguish “no implemented use cases,” “no mapped relationships” and “relationships hidden by filters.”
The catalog must remain available in a single-module application with no inter-module arrows.
Use-case labels include an accessible warning sign and explanation when a command returns information, as defined in the evidence model.
The inspector shows the mutation and return evidence, differentiates returned business information from acknowledgments or identifiers,
and explains the separation concern without hiding or approving it automatically.
Selecting a directed connection offers **Explore involved use cases**, isolating facts in that direction and expanding its endpoint parents.
Selecting an individual use case shows its incoming/outgoing facts, with arrows attached to the visible exact endpoints where verified.
Provide a clear way back to the module. An empty trace explains whether layers or missing mappings account for the empty result.

## Data-object disclosure

A data group is a visualization aid, not a use case, implementation package or independent physical store.
Name it concretely: “Customer records,” “Reporting datasets,” or “Inventory data objects,” using the project's real vocabulary.
Expand into actual named persisted structures, read models or datasets established by evidence.
For relational data, use tables/views wording only when applicable to the project.

Object details show:

- Exact object name and verified object type; unknown types remain unknown.
- Consumer use cases with command/query badges and business-module names.
- Access meaning, source evidence and source location.
- Whether business grouping or ownership is verified or inferred.
- Mapped versus unresolved aggregate-dependency counts.

Explain the distinction in plain language: commands change state, queries return information, data objects are information they access.
Keep unresolved connections attached to the group. A partially mapped group does not imply a complete data lineage inventory.

## Dependency matrix

Rows are dependents; columns are dependencies. State that interpretation next to the table.
Use the same module identities and layer filters as the map. Matrix cells aggregate mapped facts for that directed module pair.
Use a neutral diagonal, readable module headers and stable ordering. Keep row names visible while scrolling.
Clicking a populated cell opens the same connection inspector, review identity and evidence as the corresponding map connection.
Indicate reciprocal coupling and review state using accessible labels, not color alone.
The matrix compares all eligible module pairs even when the map has a module focus; make that scope difference explicit.
Counts represent evidence facts, not coupling severity, call frequency or an automatic refactoring priority.

## System context and nested detail

Show users, external systems and application boundaries first; disclose processes, infrastructure and business boundaries progressively.
Organize business boundaries and execution topology separately within the application.
Business modules spanning several execution processes must remain discoverable as shared business boundaries.
Display verified process entry points and dependencies rather than making all modules children of one process.
Do not add a second runtime tab that duplicates the expanded application view.

Expanded boundaries contain their detail. Collapse hides detail without removing the parent or its aggregate dependencies.
When expanding, project verified connections to exact visible endpoints and aggregate hidden endpoints to the nearest valid boundary.
Preserve incoming and outgoing direction; avoid self-loops created solely by aggregation.
Provide fit, zoom, pan, center selection and collapse controls, with clear navigation hints.

## Pointer and keyboard interaction

A primary-button drag works anywhere in diagram content: empty canvas, expanded boundary, component or connector.
A short movement threshold, about six screen pixels, separates click jitter from a drag. No hold delay or modifier is required.
Once the threshold is crossed, keep tracking the pointer and classify the entire gesture as a drag, even if it returns to its origin.
Releasing a drag suppresses its subsequent activation click. Release, cancellation and loss of capture clear active gesture state.
Leave controls, links and editable fields with their normal interactions. A new click after a drag behaves normally.
Keyboard expansion, inspection and focus descriptions remain available and are independent of pointer click suppression.
Map items, disclosures, matrix cells, warnings and review controls must have meaningful accessible names and keyboard access.
Opening an inspector moves focus predictably into it; closing it restores focus to its originating item when still present.
Provide keyboard-operable center/fit/zoom controls and a catalog or matrix route to inspect content without pointer panning.
Warnings expose their explanation on keyboard focus/activation as well as pointer hover; color or an icon alone is insufficient.

## Inspector and review records

A connection inspector states **A depends on B**, dependency kinds, underlying facts, exact use cases and source evidence.
Distinguish a call, a supplied callback, a direct implementation dependency and shared-data access.
Explain a reciprocal dependency as a separate observed direction; do not label it an architectural violation automatically.
Provide **unreviewed**, **justified**, **investigate**, **refactor**, a rationale field and a clear-record action.
Persist each directional canonical assessment-boundary-pair record between sessions, including process and shared-data endpoints.
Map, matrix and use-case traces share that assessment identity. If one displayed aggregate spans several canonical pairs, expose
separate reviewable sub-connections in its inspector; do not collapse their statuses or rationales into a new assessment.
Export a portable structured document containing snapshot identity, source/target identities, assessment, rationale and update time.
Show review freshness: current, stale, freshness unknown or historical/unmatched, separately from assessment status.
Expose inventory snapshot provenance and coverage. Preserve notes for deleted relationships and support explicit reconfirmation.
Disclose persistence scope and failed saves. User assessments must remain separate from extracted source facts.

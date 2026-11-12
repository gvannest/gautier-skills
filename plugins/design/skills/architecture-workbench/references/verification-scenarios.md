# Verification scenarios

Use representative project facts through the responsible public seam; avoid tests that merely assert implementation structure.
Verify the projection separately from interactive behavior where practical. Record coverage gaps rather than simulating missing evidence.
Apply concept-specific cases only when the project contains those concepts; record why an absent-concept scenario is inapplicable.
Keep the small-project empty-state and general navigation checks applicable even when there are no dependencies or data groups.
Use [Worked projection example](worked-projection-example.md) as a synthetic fixture when exact projection/count guarantees need proof;
fixture evidence must stay separate from the project's actual inventory.
For packaging, ignore behavior and process ownership, apply [Local workspace and lifecycle](local-runtime.md).
When working in a linked worktree, verify that the app lives in the persistent main checkout while evidence records its actual source.

## Inventory and meaning

- Every business module shown has evidence for its responsibility; counts adapt to the discovered project.
- A read-only result-returning use case is a query; a state-changing operation without returned information is a command without a mixed warning.
- A state-changing operation returning business information remains a command with a visible warning and mutation/return evidence.
- A command returning only an identifier or acknowledgment also has the warning, with that return category explained accurately.
- Missing mutation or return evidence is marked unknown/unverified rather than generating an invented warning.
- Each use case exposes its specific one-sentence description on hover and keyboard focus.
- A direct invocation, a supplied callback and a shared-data dependency remain distinct when the project contains them.
- A source match with an ambiguous name is not promoted into a verified dependency.
- Missing or stale source references and uncertain ownership are visibly disclosed.

## Projection

- A reader depends on the accessed data; it is not reversed into a producer-to-reader dependency.
- Reciprocal directions retain their own kinds and evidence.
- Collapsing endpoints aggregates facts; expansion projects only verified detailed endpoints.
- A directed connection trace reveals facts in that direction, excluding the reverse connection's unrelated use cases.
- Unresolved data-group facts remain group-level when named objects are exposed.
- Filters preserve direction and produce no dangling endpoints. Disabling every layer has an explicit empty state.
- Modules and all implemented use cases remain discoverable without mapped connections and do not appear proven independent.
- A single-module inventory with an isolated use case has a nonempty All use cases catalog; filters cannot remove access to that catalog.
- Multiple execution associations and shared data use canonical containment; aliases do not multiply facts or reviews.
- Repeated call sites and corroborating evidence do not inflate fact counts. Distinct contracts, roles and kinds remain distinct.
- Multi-object bindings preserve unique overall fact totals, even when one fact appears on several expanded connections.
- Asynchronous delivery is not mistaken for a direct dependency between a publisher and subscriber.
- Module ordering and positions do not change when only focus changes.

## User journeys

1. Open the module map at an ordinary readable scale. Select a module and identify its incoming and outgoing neighbors.
2. Expand that module. Verify that detail stays inside its parent and peers remain visible/reachable.
3. Select a directed connection and explore its involved use cases. Inspect a use case's description and evidence, then return to its module.
4. Expand a data group. Select a named object and confirm that only its verified consumers are listed.
5. Open the same dependency through the matrix. Confirm row-to-column direction, evidence and assessment identity match the map.
6. Save a temporary review status and rationale. Reload, revisit through the other view, verify persistence, then clear the temporary record.
7. Export reviews. Verify the export contains stable directional identities, snapshot and user notes without altering source facts.
8. Explore the system view. Business boundaries remain discoverable separately from processes, including modules used by several processes.

## Review refresh and access

- A stable identity survives a display-name change without losing its review or creating a duplicate.
- Process-to-module and module-to-shared-data connections retain canonical review identities across views and expansion.
- A visible aggregate spanning several assessment pairs exposes their separate records rather than creating or merging reviews.
- A connection's changed claims or supporting source contents mark its review stale while preserving its prior assessment and rationale.
- Unrelated source changes leave the review current; incomparable evidence produces freshness unknown.
- Removed connections retain historical/unmatched notes. A failed save is visible and existing notes remain exportable.
- The user can inspect map items and matrix cells, open/close the inspector, read warnings and edit reviews using only the keyboard.
- Focus returns to the originating item after inspector close; a fallback is chosen predictably if that item no longer exists.
- Center/fit/zoom controls and the catalog or matrix allow navigation without pointer dragging.

## Gesture regression

Using actual pointer input when available:

- Drag from empty space within a very large expanded boundary. Its contents move and the boundary stays expanded.
- Drag directly over a component. The canvas pans and the component is not activated on release.
- Drag past the threshold and return to the origin. Release still does not activate the component.
- Small movement below threshold leaves the diagram stationary and permits a normal click.
- Click a component after dragging, then activate it by keyboard. Both still expand or inspect normally.
- Cancel a drag or lose pointer capture. The next gesture and normal controls work; there is no stuck dragging state.
- Zooming and dragging remain correct at different scales; movement threshold is measured in screen coordinates.

## Readability and completion

Check the user's current surface, including a narrow layout where relevant:

- Module names, arrow direction, badges and inspector controls are readable without extreme zooming.
- Connectors avoid card text; labels/badges do not overlap. Text labels accompany color distinctions.
- Peer order survives expansion. Scrolling reaches larger content; dismissing the inspector restores space.
- Layer controls disclose hidden facts; matrix scope and fact counts are explained.
- The artifact actually launches and supports the intended exploration, rather than stopping at an intermediate page or a static rendering.

Deliver a concise verification summary with the running artifact and evidence-coverage limits.

## Scoped funnel, sequences and detailed data

- Direct entry to a bounded context reveals all its use cases and only direct relevant external neighbors.
- A use-case deep link loads without a full-application inventory; unknown roots and unavailable detail have useful empty states.
- External discovery gaps are visible; no mapped incoming fact does not prove the absence of callers.
- Application → context → use case and browser Back restore selection, filters, scenario and viewport at each level.
- Dependencies, execution flow and data model occupy separate surfaces and share canonical selected identities.
- An inspector opened for one route cannot reference a missing use case after breadcrumb or browser navigation.
- Sequence order/branches come from implementation or identified runtime evidence, never dependency graph ordering.
- Selecting a database step opens its exact verified tables/columns; the data view links back to the originating step/scenario.
- Repeated accesses, alternative paths, rollback and asynchronous boundaries remain distinguishable where present.
- Captured schema metadata is labeled with its provenance; missing types, keys or nullability remain unknown.
- Accessed columns and keys are initially visible; Show all columns exposes the rest without marking them accessed.
- READ, INSERT, UPDATE and DELETE remain distinct; a predicate read and a SET target are not conflated.
- Row deletion is identified as row-level impact rather than fabricated writes to every column.
- Enforced foreign keys, code joins and view lineage have distinct labels and evidence.
- Related schema neighbors expand explicitly; adjacency alone does not imply direct or indirect use-case impact.
- An indirect cascade/trigger impact requires evidence and conditions; incomplete dynamic lineage is disclosed.
- At normal desktop and narrow widths, labels stay readable and diagram overflow scrolls within its own workspace.
- Evidence panels are dismissible and keyboard reachable; return restores focus to the source selection.

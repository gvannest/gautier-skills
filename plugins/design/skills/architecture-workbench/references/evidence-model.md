# Evidence model

This is a logical model, independent of serialization format or implementation language.
Choose a representation appropriate for the project while preserving these identities and relationships.

## Nodes

| Field | Meaning |
| --- | --- |
| identity | Stable identity, independent of display name, position or selection. |
| name | User-facing project vocabulary. |
| classification | Node kind, from the extensible taxonomy below. |
| parent | One canonical containment parent, where established; containment is acyclic. |
| business module | Logical business association; distinct from process location and physical schema ownership. |
| behavior | Command, query or unknown; record observed state changes and return behavior separately. |
| description | Specific concise responsibility; use cases receive a one-sentence hover/focus description. |
| entry and implementation | Verified public entry point and source locations when applicable. |
| evidence | Source references supporting the node, its type and claimed boundaries. |
| uncertainty | Unresolved classification, grouping, ownership or incomplete discovery. |

Node kinds include actor/user, system/application boundary, business module, use case, process, supporting module,
infrastructure, external system, data group and data object.

Containment, business association and execution association are different relationships.
A use case has one canonical containing business module when established; a shared data object can have several business associations.
Each execution association identifies a process and the specific use case it executes, with its evidence.
A shared business module remains one logical node, rather than becoming a child of several processes.
Canonical shared data lives in an explicit shared-data boundary when exclusive containment is not established.
Optional visual aliases reference the same identity and do not duplicate facts, reviews or counts.
Structural containment and association links are labelled as structure, not rendered as dependency arrows without dependency evidence.
Extend the taxonomy when the project needs another concept, defining its meaning rather than forcing it into an unrelated class.
A data group may contain named objects while remaining an inferred business association.
Use an explicit unknown type rather than inferring an object's physical kind from its name.

## Use-case behavior warnings

Observable business/application state changes take precedence over return shape when classifying behavior.
A state-changing operation remains a command when it returns a result. A read-only result-returning operation is a query.
Record mutation evidence, return evidence and return category: business information, acknowledgment/identifier, no information or unknown.

Whenever a command returns information, render a visible **Command also returns information** warning beside its use-case label.
The inspector explains what changes, what is returned, why this is a separation concern, and where both behaviors are evidenced.
Include acknowledgments and identifiers in this warning policy, while describing their limited return role accurately.
Do not infer a defect, silently approve the design, relabel the operation as a query, or automatically change the source.
Offer the concern for review: separate behavior where appropriate, or record the user's explicit justification for the result contract.
Unknown behavior is marked unverified; do not invent a mutation or a returned payload to generate a warning.

## Inventory snapshots

Every inventory has a project-scoped snapshot identity, capture time and provenance/coverage statement.
Record available source revisions, whether local modifications were included, and unavailable source or runtime observations.
For unversioned inputs, identify the captured source contents reproducibly and state the limitation.
Evidence refers to this snapshot; optional per-observation timestamps add detail rather than replace inventory provenance.

## Dependency facts

Each fact contains a stable identity, dependent identity, dependency identity, kind, action description and supporting evidence.
Store exact use-case or object endpoints when verified, even when an overview displays their enclosing modules.
Support at least these kinds where present:

- Direct calls or invocations.
- Direct implementation imports/references.
- Supplied callbacks or contracts wired by composition.
- Access to data associated with another business boundary.
- Access to physical infrastructure or storage.

Record each direction independently. Infrastructure invoking business work and business work reporting to infrastructure are two facts.
A supplied callback does not establish a direct implementation import. Data access does not establish a call to another module's query.
Control dependence and data provenance have different meanings; do not mix producer-to-consumer flow into dependent-to-dependency arrows.

Evidence includes repository-relative location, symbol or source range, claim supported, observation method and inventory snapshot.
Additional relationship kinds, when present, must define the dependent, dependency and sufficient supporting evidence.
For asynchronous interactions, a publisher may depend on a channel contract and a subscriber on a subscription/event contract.
Observed event delivery alone does not establish a direct publisher-to-subscriber or subscriber-to-publisher dependency.
User interaction with an application is a usage relationship; label it as such rather than treating it as an implementation import.
Information flow can be documented separately, with a distinct legend and meaning, rather than reversing dependency arrows.
Validate references against the source. Resolve ambiguous same-name symbols before asserting caller/callee relationships.
Where documentation and implementation differ, disclose the mismatch rather than silently merging their claims.
Static code evidence, documented design and runtime observation should be distinguishable in the inspector.
A complete runtime or data-lineage claim requires evidence beyond a partial static inventory.

## Fact identity and counting

A fact is one logical relationship, identified by dependent, dependency, kind and explicit contract/access role.
Repeated call sites and corroborating static or runtime observations of that same relationship are additional evidence records.
Separate imports and invocations remain distinct kinds, even when they corroborate the same module-level coupling.
Preserve distinct named contracts or read/write roles between the same endpoints; preserve their separate fact identities.
Keep this rule stable across inventory refreshes and disclose that counts describe these logical facts.

An aggregate fact bound to several objects remains one fact. An expanded view may display that fact on several object connections.
Each badge counts distinct fact identities on that connection; overall totals count their union, not the sum of badges.
Do not add a duplicate group-level fact when object bindings resolve an existing group-level relationship.

## Data bindings

Keep group-level dependency facts and verified object bindings separate.
A binding associates a fact with one or more exact data objects and the source reference supporting each association.
Evidence that a use case accesses a group is not evidence that it accesses every object in that group.
A shared object may have several consumers or business associations without an exclusive owner.

Count resolved group facts separately from unresolved ones. Show object-level arrows only for resolved bindings.
When an object is hidden, its dependency projects back to the visible group or business boundary.
When a group expands, unresolved facts remain attached to the group rather than disappearing or fanning out.

## Display projection

Derive display connections from facts; layout is not the source of truth.

1. Apply the selected dependency layers and supporting-module visibility.
2. Apply module, directed-connection or use-case focus without changing stable module order.
3. Resolve endpoints to the exact visible canonical node or its nearest visible canonical containment ancestor.
   Business/execution associations do not select a parent. Shared unowned objects resolve to the explicit shared-data boundary.
   If no visible canonical ancestor exists, expose an unresolved/external endpoint instead of choosing an arbitrary associated module.
4. Aggregate by directed visible pair for the module map, retaining underlying fact identities and kinds.
5. Suppress artificial same-boundary loops in aggregate views; retain actual internal relationships in a detailed trace.

Each displayed endpoint exists. Filtering cannot reverse a fact or change its meaning.
Expansion and collapse preserve fact identities and evidence even when the number of displayed connections changes.
Fact counts, distinct connection counts and execution frequency are separate quantities.

## Review identity and migration

Assign each logical endpoint a stable canonical assessment-boundary identity, independently of the current view or expansion.
For business use cases this is their containing business module; for shared objects it is their canonical shared-data boundary.
Processes, actors, infrastructure, supporting modules and external systems use their own canonical identities unless a narrower
established assessment boundary is explicitly recorded. A displayed application boundary can use its own identity for facts established there.
Key each review by project identity and the ordered pair of canonical dependent/dependency assessment-boundary identities.
Thus process-to-module, module-to-shared-data and ordinary module-to-module dependencies all have specified review identities.

A collapsed display connection may contain facts from several canonical assessment pairs.
Its inspector exposes those distinct reviewable sub-connections and their existing assessments, rather than inventing a new review key
from the transient visible aggregate or combining unrelated rationales. Detailed and matrix selections reuse the same canonical records.
A name change, filter, view switch, expansion or use-case trace must not create a new review for the same module pair.
Store assessment, rationale, update time and source snapshot separately from the architecture inventory.
If source identities change, preserve unmatched reviews as historical/unmatched records rather than attaching them to guessed replacements.
Store the reviewed connection's evidence fingerprint with the assessment: fact identities, endpoint identities, kinds and supported claims.
On refresh, changed relationship semantics or supporting source contents mark the assessment **stale** visibly.
Unrelated source changes, layout changes, aliases and display-name changes alone do not make it stale.
If a fingerprint cannot be compared reliably, show **freshness unknown**, rather than asserting that the review is current.
Deleted relationships become historical/unmatched records. Retain their rationale and snapshot without silent reassignment.
A stale flag is separate from the user's assessment; preserve the assessment and let the user explicitly confirm it against new evidence.

Read [Worked projection example](worked-projection-example.md) for canonical associations, counting and expected connections.

## Scoped execution and schema evidence

Follow [Scoped funnel and use-case detail](scoped-funnel.md) for sequence/scenario and column-access records.
Record the analyzed root and investigated boundary directions separately from the visible scope and active filters.
Keep canonical node/fact/review identities across direct links, application views and scoped views.
A scoped inventory can be complete for its root while external internals and incoming discovery remain partial.
Sequence steps are scenario-specific ordered observations, not a topological sort of dependency facts.
Schema relationships have their own identity and notation; an enforced key, observed join and view lineage are distinct claims.

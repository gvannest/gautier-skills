# Worked evidence and projection example

Illustrative synthetic fixture, independent of implementation. Do not copy these invented facts into a real project's inventory.
Use it to check containment, multiple associations, counts and unresolved data bindings.

## Canonical nodes and associations

| Identity | Meaning | Canonical containment parent |
| --- | --- | --- |
| app | Application boundary | none |
| desk | Interactive execution process | app |
| worker | Background execution process | app |
| records | Business module | app |
| reports | Business module | app |
| create | Create record, command | records |
| find | Find record, query | records |
| probe | Read local readiness, query with no mapped dependency | records |
| summary | Read summary, query | reports |
| legacy | Legacy records data group | records |
| legacy-item | One known object in that group | legacy |
| shared | Shared-data boundary | app |
| shared-records | Shared records data group | shared |
| object-a | Shared named object A | shared-records |
| object-b | Shared named object B | shared-records |

Execution associations: desk executes create; worker also executes create.
Business associations: records and reports both use the shared objects. These associations are not containment.
The two processes and the shared objects each retain one canonical identity; Records is not nested under either process.
The source behavior of create changes a record and returns business information about it.
Its label is **C ! Create record**, with a warning explaining mutation, return and evidence rather than relabelling it as a query.

## Facts at snapshot S1

Each listed fact has evidence supporting its exact relationship. The names below stand for source-backed contracts in a real project.

| Fact | Dependent -> dependency | Kind / contract or role | Object binding |
| --- | --- | --- | --- |
| F1 | desk -> create | call / interactive submission | none |
| F2 | worker -> create | callback / background creation | none |
| F3 | summary -> object-a | data access / read | already exact |
| F4 | create -> shared-records | data access / write | object-a and object-b, both verified |
| F5 | find -> legacy | data access / read | unresolved |
| F6 | create -> summary | call / summary lookup | none |
| F7 | records -> reports | implementation reference / report interface | none |

F6 has two call-site references and one corroborating observation. They are evidence for one logical fact, not three facts.
F7 remains separate from F6 because implementation reference and invocation are different relationship kinds.
The inventory contains seven facts. Record the capture time, source identity, included local modifications and coverage in S1.
Known legacy-item does not imply F5 accesses it; that association is unverified.

## Expected projection

Assume all fact kinds and processes are enabled. All business and shared-data boundaries are initially collapsed.

| Displayed connection | Fact identities | Badge |
| --- | --- | --- |
| desk -> records | F1 | 1 |
| worker -> records | F2 | 1 |
| reports -> shared | F3 | 1 |
| records -> shared | F4 | 1 |
| records -> reports | F6, F7 | 2 |

F5 is internal to collapsed Records and creates no artificial self-loop.
The overview has five displayed connections and six visible unique facts, while seven facts remain in the eligible inventory.
Focusing Records keeps module positions and ordering fixed, and shows its incident connections.
The matrix cell at row Records, column Reports has badge 2 and opens the same directional review as the map connection.

Expand Records and Reports, retaining exact use-case endpoints:

- desk -> create carries F1; worker -> create carries F2.
- create -> summary carries F6; records -> reports carries F7, whose evidence is only module-level.
- find -> legacy carries F5 when that internal detail is included in the trace.
- probe remains accessible through All use cases, even though it has no arrows.

Expand the shared-data boundary and shared-records group:

- summary -> object-a carries F3, badge 1.
- create -> object-a carries F4, badge 1; create -> object-b also carries F4, badge 1.
- These three badges describe two unique facts, F3 and F4. Overall totals use the union of identities.
- Expanding legacy exposes legacy-item but leaves F5 attached to legacy; no find -> legacy-item edge is invented.

With only calls enabled, F1 and F6 remain: two eligible facts and two visible directed connections in the fully collapsed overview.
With every layer disabled, no connections remain, but all three Records use cases stay discoverable in the catalog.
A single-module version containing only records and probe still produces a useful nonempty behavior catalog.

## Asynchronous variation, only when present

Suppose one process publishes an event and another process subscribes to it through an intermediary contract.
Record a publishing dependence on that intermediary/contract and a subscribing dependence on its subscription/event contract,
provided each has evidence. The event's delivery direction does not establish a direct dependency between publisher and subscriber.
If source evidence separately establishes a consumer's dependence on a producer-owned event schema, record that distinct contract fact.
Label user-to-application interaction as usage, rather than implementation coupling.

## Review identity across endpoint kinds

At project P, F1 is reviewed as P / desk -> records; F2 as P / worker -> records.
F3 is reviewed as P / reports -> shared, and F4 as P / records -> shared, even after their object endpoints expand.
F6 and F7 share P / records -> reports. F5 has the internal pair P / records -> records when exposed for review.
If collapsing app produces a visible app -> shared connection containing F3 and F4, the inspector presents the two existing
reports -> shared and records -> shared assessments separately; it does not invent an app -> shared assessment for those facts.

## Snapshot refresh and review fixture

A user reviews records -> reports at S1 with assessment Justified and a rationale, using stable endpoint identities.

- Rename the displayed Records title: the same review remains current; no new identity or assessment is created.
- Add an unrelated module: this connection's evidence fingerprint is unchanged and its review stays current.
- Change F6's contract or the supporting source contents: show the existing assessment with a Stale indicator and its S1 rationale.
- Remove F6 and F7: preserve the record as historical/unmatched; do not attach it to another similarly named connection.
- Lose the ability to compare evidence: show Freshness unknown rather than claiming the assessment is current.
- Reconfirm against verified S2 evidence explicitly: retain review history or prior snapshot association as supported by the artifact.
- Fail a save: show the error and keep the unsaved/current notes available for export.

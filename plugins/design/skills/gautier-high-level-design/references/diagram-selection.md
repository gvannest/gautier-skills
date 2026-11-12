# Mermaid diagram selection

Choose by the information to communicate, not by visual novelty. The avoidance guidance below is practical selection advice.
Links point to official syntax documentation. This catalog was checked on 2026-11-04; consult the
[current Mermaid catalog](https://mermaid.js.org/intro/) for additions and compatibility changes.

## Processes, interactions, and behaviour

| Type and syntax | Use to show | Avoid when / prefer instead |
|---|---|---|
| [Flowchart][flowchart] | Steps, decisions, branches, dependencies, data flow. | Call order: sequence. Entity lifecycle: state. |
| [Swimlanes][swimlanes] | Process steps grouped by owner; handoffs. | Ownership adds little; use flowchart. Precise exchanges: sequence. |
| [Sequence][sequence] | Participants, ordered messages, responses, retries, alternatives. | Static topology or all lifecycle rules matter most. |
| [ZenUML][zenuml] | Sequence-style interactions using code-like syntax. | Standard sequence suffices or the integration is unavailable. |
| [State][state] | States of an entity, events, allowed transitions. | Nodes are tasks or services, rather than states. |
| [Event modeling][events] | Commands, events, read models, UI, information changing over time. | Only API call order is needed; use sequence. |
| [Use case][usecase] | Actors and their goals within a system boundary. | Execution steps, screen navigation, or implementation matter. |
| [User journey][journey] | Experience across stages, participants, satisfaction. | Precise execution logic or technical interactions matter. |

## Structure, architecture, and relationships

| Type and syntax | Use to show | Avoid when / prefer instead |
|---|---|---|
| [Class][class] | Types, attributes, operations, inheritance, composition. | Data cardinality: ER. Service topology: architecture view. |
| [Entity relationship][er] | Entities, attributes, relationship cardinalities. | Behaviour, calls, or data movement is the question. |
| [C4][c4] | System context, containers, components, dynamic or deployment views. | Mixed abstraction levels obscure the question. |
| [Architecture][architecture] | Infrastructure resources, services, groups, connections. | Business logic or interaction order is the question. |
| [Block][block] | Components whose deliberate spatial arrangement aids explanation. | Automatic flowchart layout suffices or time is central. |
| [Mindmap][mindmap] | Ideas branching from a central topic; conceptual decomposition. | Many cross-links or precisely typed relations are needed. |
| [TreeView][tree] | Rooted hierarchies such as folders or nested structures. | Multiple parents or many cross-links require a graph. |
| [Packet][packet] | Bit positions and field widths in a binary packet or header. | Network topology or packet travel is the subject. |

C4 defines architecture viewpoints; native C4 syntax is not the only way to express those viewpoints.
A flowchart with explicit system boundaries can express a C4-structured view when native C4 support is unsuitable.
Check the [C4 implementation's experimental status and limitations][c4] before selecting it.

## Planning, work, and traceability

| Type and syntax | Use to show | Avoid when / prefer instead |
|---|---|---|
| [Gantt][gantt] | Tasks, durations, overlap, dependencies, milestones. | Speculative dates mislead; simple events need a timeline. |
| [Timeline][timeline] | Events and milestones in chronological periods. | Duration, overlap, or scheduling dependencies matter. |
| [Kanban][kanban] | Work items grouped by status. | A live tracker with assignments and automation is needed. |
| [Git graph][git] | Commits, branches, merges, branching strategies. | General task dependencies or non-Git chronology is needed. |
| [Requirement][requirements] | Requirements, derivation, satisfaction, verification. | A checklist or traceability table is clearer. |

Use Git tooling for authoritative repository history; a hand-authored Git graph is an explanatory view.

## Numbers, proportions, and comparisons

| Type and syntax | Use to show | Avoid when / prefer instead |
|---|---|---|
| [XY chart][xy] | Bar comparisons and line trends. | Statistical graphics, uncertainty, or rich interaction is needed. |
| [Pie][pie] | A few categories making up one meaningful whole. | Overlap, negative values, many slices, small differences: use bars. |
| [Sankey][sankey] | Quantified flows between stages; width encodes amount. | Edges mean dependencies or quantities are unknown. |
| [Treemap][treemap] | Hierarchical parts of a whole; area encodes size. | Precise comparison of similar values matters most. |
| [Radar][radar] | A few profiles across consistently scaled dimensions. | Incomparable scales, many profiles, exact ranking: table or bars. |
| [Quadrant][quadrant] | Options positioned on two meaningful dimensions. | Two dimensions oversimplify or estimates look like measured facts. |
| [Venn][venn] | Membership and intersections among a few sets. | Many sets or precise quantitative comparison is needed. |

Keep units, reporting periods, denominators, and scales explicit when they affect interpretation.
Sequence diagram spacing is not a measured time scale. Radar polygon area is not a reliable overall score.
For demanding analytical charts, use an appropriate plotting tool rather than forcing the data into Mermaid.

## Analysis and strategy

| Type and syntax | Use to show | Avoid when / prefer instead |
|---|---|---|
| [Ishikawa / fishbone][ishikawa] | Categories of possible causes contributing to a problem. | Proven causation or an incident sequence is required. |
| [Wardley map][wardley] | Value chains, user visibility, component evolution. | Only topology matters or evolution positions lack justification. |
| [Cynefin][cynefin] | Causal contexts and suitable decision approaches. | Numerical ranking, process logic, or generic XY comparison is needed. |

A fishbone organizes causal hypotheses; it does not establish their truth.
Wardley maps support strategy such as build/buy decisions. Cynefin supports choosing how to approach different kinds of situations.

## Compatibility and syntax

Beta suffixes, feature availability, and syntax differ across Mermaid versions and host applications.
Follow the selected type's current documentation rather than guessing its declaration from the display name.
For example, native use-case diagrams were documented as requiring Mermaid 12.0.0+ when this catalog was checked.
Check the host's bundled version; success in an online editor alone does not prove the destination supports the diagram.
If a type is unsupported, explain the limitation and recommend a supported representation that preserves the intended meaning.

- [General syntax](https://mermaid.js.org/intro/syntax-reference.html)
- [Configuration](https://mermaid.js.org/config/configuration.html)
- [Accessibility](https://mermaid.js.org/config/accessibility.html)
- [Mermaid CLI](https://github.com/mermaid-js/mermaid-cli)
- [Live editor](https://mermaid.live/)

[flowchart]: https://mermaid.js.org/syntax/flowchart.html
[swimlanes]: https://mermaid.js.org/syntax/swimlanes.html
[sequence]: https://mermaid.js.org/syntax/sequenceDiagram.html
[zenuml]: https://mermaid.js.org/syntax/zenuml.html
[state]: https://mermaid.js.org/syntax/stateDiagram.html
[events]: https://mermaid.js.org/syntax/eventmodeling.html
[usecase]: https://mermaid.js.org/syntax/usecase.html
[journey]: https://mermaid.js.org/syntax/userJourney.html
[class]: https://mermaid.js.org/syntax/classDiagram.html
[er]: https://mermaid.js.org/syntax/entityRelationshipDiagram.html
[c4]: https://mermaid.js.org/syntax/c4.html
[architecture]: https://mermaid.js.org/syntax/architecture.html
[block]: https://mermaid.js.org/syntax/block.html
[mindmap]: https://mermaid.js.org/syntax/mindmap.html
[tree]: https://mermaid.js.org/syntax/treeView.html
[packet]: https://mermaid.js.org/syntax/packet.html
[gantt]: https://mermaid.js.org/syntax/gantt.html
[timeline]: https://mermaid.js.org/syntax/timeline.html
[kanban]: https://mermaid.js.org/syntax/kanban.html
[git]: https://mermaid.js.org/syntax/gitgraph.html
[requirements]: https://mermaid.js.org/syntax/requirementDiagram.html
[xy]: https://mermaid.js.org/syntax/xyChart.html
[pie]: https://mermaid.js.org/syntax/pie.html
[sankey]: https://mermaid.js.org/syntax/sankey.html
[treemap]: https://mermaid.js.org/syntax/treemap.html
[radar]: https://mermaid.js.org/syntax/radar.html
[quadrant]: https://mermaid.js.org/syntax/quadrantChart.html
[venn]: https://mermaid.js.org/syntax/venn.html
[ishikawa]: https://mermaid.js.org/syntax/ishikawa.html
[wardley]: https://mermaid.js.org/syntax/wardley.html
[cynefin]: https://mermaid.js.org/syntax/cynefin.html

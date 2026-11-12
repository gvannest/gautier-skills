# Architecture and system-behaviour diagrams

Create architecturally faithful, approachable diagrams with one clear story per view.
Reuse the purpose and selected type already established; ask only for missing decisions.

## Confirm the brief

Interview in short rounds only for unresolved decisions. Ask at most four numbered questions per round and recommend a default.
Settle:

1. audience and decision supported;
2. current, target, proposed, or comparative state;
3. boundary and detail level;
4. artifact and important inclusions or omissions.

Default to one smallest useful view; split mixed audiences or abstraction levels.

Summarize the agreed audience, question, scope, state, notation, and artifact. Obtain confirmation before drawing;
reuse prior confirmation of that same brief rather than asking again.

## Choose the diagram agent

Ask the user which model and reasoning effort to use for the diagram, unless both are already explicitly established for this diagram in the conversation. Wait for their choice before delegation.

Check the current harness model catalog to verify that the chosen model and effort are available. If either is unavailable, explain the constraint and ask for an alternative. Use the user's explicit selection; do not select, recommend, or save a default model or reasoning effort.

The current agent owns the interview and final presentation. Delegate repository inspection, drafting, and refinement to the selected subagent.
If suitable subagent delegation is unavailable, ask the user before proceeding in the current agent.

## Compose

C4 describes the viewpoint, not the required syntax. Prefer a C4-structured flowchart when it communicates
more clearly than native Mermaid C4; preserve an explicitly agreed notation.

- Default architecture and process views to top-to-bottom (`TB`).
- Keep external actors outside the owned boundary.
- Use subgraphs only for real ownership, deployment, bounded-context, or lifecycle boundaries.
- Keep the happy path central; branch retries, failures, and observability sideways.
- Use concise noun labels for nodes and verb or event labels for edges.
- Use at most four accessible semantic colors: external, compute, data, and operations. Meaning must remain clear without color.
- Always include a concise visual legend inside every diagram. Show one styled example for each semantic component type used.
- Match legend examples to the actual colors, shapes and line styles; label only their meaning, without spelling out color or shape names.
- Use short labels such as "New component", "Updated component", "Existing component", "External service" and "Storage".
- Distinguish existing components changed by the design from unchanged/reused components. Default: existing fill with a dotted new-component border.
  With the default palette, use a blue fill and dotted purple border (`stroke-dasharray:2 3`) for updated components.
- Include an "Updated component" legend exemplar whenever showing change status; apply it only to components actually being modified.
  Apply change status independently at every displayed level: service/container boundaries and individual component nodes.
  Mark an existing service as updated when its responsibilities or composition change; also mark each existing child whose behavior changes.
  Unchanged children retain their existing style inside an updated boundary. New children retain their new-component style.
  Example: if lease renewal changes, mark that existing lease-renewal node and its owning worker boundary as updated,
  while unchanged startup recovery and collection nodes remain existing. Mark every changed child individually, not just its boundary.
  If a node combines changed and unchanged responsibilities, mark it updated; split it only when the distinction aids this view.
- Keep the legend separate from the workflow, with no flow edges to it.
- Prefer words over emoji or vendor icons unless requested.
- Show `Architecture snapshot — YYYY-MM-DD` and clearly mark current, target, or proposed state.

## Create the artifact

Keep `.mmd` as the canonical source. Place it beside the Markdown document that owns it;
use `docs/diagrams/<name>.mmd` only when standalone or shared.
Keep its filename stable when regenerating it so Git history preserves earlier snapshots.

Generate the SVG in `/private/tmp` for review. Commit an SVG only when permanent Markdown embeds it.
When supported, open the rendered SVG in the right panel and keep comments anchored to the `.mmd` source.

## Validate and iterate

Validation is mandatory here. Use the `mmdc` command from the main skill on demand, without installing Mermaid dependencies in the repository.
A zero exit code confirms that Mermaid parsed the source. If the command or package is unavailable, stop and ask the user
rather than skipping validation or substituting another tool.

Inspect `/private/tmp/diagram.svg` for crossed edges, weak hierarchy, clipping, crowding, and unreadable labels.
Fix both syntax and visual defects before presenting it.

Report `validated` only when the command succeeded in the current run and the rendered output was visually inspected.
Otherwise state exactly what remains unverified.

Present the preview, invite comments, and iterate in small visual passes until the user approves it.

## Output

Return the `.mmd` path, rendered preview, one-sentence description, necessary assumptions or legend, and validation status.

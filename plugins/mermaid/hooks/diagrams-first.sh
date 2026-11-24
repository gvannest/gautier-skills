#!/bin/bash
# Prints the diagrams-first rule into the session's context.
#   session  full rule, at startup, resume, clear and after compaction
#   prompt   one-line reminder with every user message, so it stays recent
case "$1" in
  session)
    cat <<'RULE'
Explanation style: use Mermaid diagrams as the norm for explanations, with text only to support the diagrams. Text only is the exception, not the rule. Exceptions, answered in plain text: a short fact, a code change, a yes/no answer, commit messages and other text artifacts.

Choose the diagram type by the question the reader needs answered; a flowchart is not the default:
- calls, messages, retries, who talks to whom in what order: sequenceDiagram
- an entity's states and allowed transitions (lifecycle, status): stateDiagram-v2
- tasks with durations and dependencies (plan, schedule): gantt; dated events without durations: timeline
- entities and their relationships (data model, schema): erDiagram
- types, modules and their structure: classDiagram; system parts and boundaries: flowchart with subgraphs or C4
- steps, decisions and data flow: flowchart
- ranking or positioning on two axes: quadrantChart; ideas or a topic breakdown: mindmap; proportions: pie
Before drawing anything beyond a trivial diagram, load the mermaid:mermaid-diagrams skill and follow its selection catalog. Split distinct questions into separate diagrams of different types. When the content is a plain list or a comparison of attributes, use a list or a table instead of forcing it into boxes and arrows.
RULE
    ;;
  prompt)
    echo "Reminder: explain with a Mermaid diagram first, prose only supports it (except short facts, code changes, yes/no). Pick the type that fits the question (sequence, state, gantt, timeline, ER, class, flowchart...), not a flowchart by default."
    ;;
esac
exit 0

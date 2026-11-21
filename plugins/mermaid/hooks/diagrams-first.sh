#!/bin/bash
# Prints the diagrams-first rule into the session's context.
#   session  full rule, at startup, resume, clear and after compaction
#   prompt   one-line reminder with every user message, so it stays recent
case "$1" in
  session)
    cat <<'RULE'
Explanation style: use Mermaid diagrams as the norm for explanations, with text only to support the diagrams. Text only is the exception, not the rule. Exceptions, answered in plain text: a short fact, a code change, a yes/no answer, commit messages and other text artifacts.
RULE
    ;;
  prompt)
    echo "Reminder: explain with a Mermaid diagram first, prose only supports it (except short facts, code changes, yes/no)."
    ;;
esac
exit 0

#!/bin/bash
# Installs gautier-skills packs at user scope inside a Claude Code cloud VM.
# A cloud environment's setup script sets PACKS (and EXTRA_MARKETPLACES when a
# bundle needs one), then runs this file. See cloud/README.md.
#
#   PACKS="design mermaid pocock"            packs from gautier-skills
#   EXTRA_MARKETPLACES="Facta-Dev/beautifulgo" GitHub repos of extra marketplaces
#
# Never fails the session: every step is best effort, and the log is kept at
# ~/.claude/gautier-skills-setup.log.

LOG="$HOME/.claude/gautier-skills-setup.log"
mkdir -p "$HOME/.claude"
exec >>"$LOG" 2>&1
echo "== $(date -u +%FT%TZ) packs: ${PACKS:-<none>} extra: ${EXTRA_MARKETPLACES:-<none>}"

CLAUDE="$(command -v claude)"
if [ -z "$CLAUDE" ]; then
  echo "claude CLI not on PATH; nothing installed"
  exit 0
fi

# HTTPS URLs, not owner/repo shorthand: the VM has no SSH key for GitHub.
for m in gvannest/gautier-skills $EXTRA_MARKETPLACES; do
  "$CLAUDE" plugin marketplace add "https://github.com/$m.git" || true
done
for p in $PACKS; do
  "$CLAUDE" plugin install "$p@gautier-skills" --scope user || true
done

"$CLAUDE" plugin list || true
exit 0

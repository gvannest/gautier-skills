#!/bin/bash
# Installs gautier-skills packs at user scope inside a Claude Code cloud VM.
# A cloud environment's setup script sets PROFILE, then runs this file.
# See cloud/README.md.
#
#   PROFILE=go    loads cloud/profiles/go.env, which sets:
#     PACKS                packs from gautier-skills
#     EXTRA_MARKETPLACES   GitHub repos of marketplaces some bundles need
#
# PACKS and EXTRA_MARKETPLACES can also be set directly instead of PROFILE.
# Never fails the session: every step is best effort, and the log is kept at
# ~/.claude/gautier-skills-setup.log.

LOG="$HOME/.claude/gautier-skills-setup.log"
mkdir -p "$HOME/.claude"
exec >>"$LOG" 2>&1

if [ -n "$PROFILE" ]; then
  PROFILE_FILE="$(dirname "$0")/profiles/$PROFILE.env"
  if [ -f "$PROFILE_FILE" ]; then
    . "$PROFILE_FILE"
  else
    echo "unknown profile: $PROFILE"
  fi
fi
echo "== $(date -u +%FT%TZ) profile: ${PROFILE:-<none>} packs: ${PACKS:-<none>} extra: ${EXTRA_MARKETPLACES:-<none>}"

CLAUDE="$(command -v claude)"
if [ -z "$CLAUDE" ]; then
  echo "claude CLI not on PATH; nothing installed"
  exit 0
fi

# HTTPS URLs, not owner/repo shorthand: the VM has no SSH key for GitHub.
# A fresh VM doesn't know Anthropic's official marketplace, which several
# bundles (pocock, railway, playwright, github) depend on, so add it too.
for m in anthropics/claude-plugins-official gvannest/gautier-skills $EXTRA_MARKETPLACES; do
  "$CLAUDE" plugin marketplace add "https://github.com/$m.git" || true
done
for p in $PACKS; do
  "$CLAUDE" plugin install "$p@gautier-skills" --scope user || true
done

"$CLAUDE" plugin list || true
exit 0

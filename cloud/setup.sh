#!/bin/bash
# Installs gautier-skills packs at user scope inside a Claude Code cloud VM.
# A cloud environment's setup script sets PROFILE, then runs this file.
# See cloud/README.md.
#
#   PROFILE=go            loads cloud/profiles/go.env, which sets:
#     PACKS                 packs from gautier-skills
#     EXTRA_MARKETPLACES    GitHub repos of marketplaces some bundles need
#   PROFILE="go notes"    loads several profiles and installs all their packs
#
# PACKS and EXTRA_MARKETPLACES can also be set directly, alone or on top of
# PROFILE.
# Never fails the session: every step is best effort, and the log is kept at
# ~/.claude/gautier-skills-setup.log.

LOG="$HOME/.claude/gautier-skills-setup.log"
mkdir -p "$HOME/.claude"
exec >>"$LOG" 2>&1

ALL_PACKS="$PACKS"
ALL_EXTRA="$EXTRA_MARKETPLACES"
for name in $PROFILE; do
  PROFILE_FILE="$(dirname "$0")/profiles/$name.env"
  if [ -f "$PROFILE_FILE" ]; then
    PACKS="" EXTRA_MARKETPLACES=""
    . "$PROFILE_FILE"
    ALL_PACKS="$ALL_PACKS $PACKS"
    ALL_EXTRA="$ALL_EXTRA $EXTRA_MARKETPLACES"
  else
    echo "unknown profile: $name"
  fi
done
# Drop duplicates, so a pack shared by two profiles installs once.
PACKS="$(echo $ALL_PACKS | tr ' ' '\n' | awk 'NF && !seen[$0]++' | tr '\n' ' ')"
EXTRA_MARKETPLACES="$(echo $ALL_EXTRA | tr ' ' '\n' | awk 'NF && !seen[$0]++' | tr '\n' ' ')"
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

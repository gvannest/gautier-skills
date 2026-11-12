# Packs in cloud sessions

Cloud sessions don't install plugins that a repo's `.claude/settings.json` enables. They do run an environment's setup script before Claude starts, and they keep what it writes to `~/.claude`. So each cloud environment acts as a skill profile: create one environment per kind of work, and pick it when you start a session.

## Set up an environment

At claude.ai/code, add or edit an environment, open **Setup script**, and paste one of the profiles below. Keep network access at **Limited** (the default), which reaches GitHub.

```bash
#!/bin/bash
export PACKS="design mermaid pocock"
export EXTRA_MARKETPLACES=""
git clone --depth 1 https://github.com/gvannest/gautier-skills.git /tmp/gautier-skills || exit 0
bash /tmp/gautier-skills/cloud/setup.sh
```

Profiles:

| Environment | `PACKS` | `EXTRA_MARKETPLACES` |
|---|---|---|
| React Native | `callstack vercel react design mermaid pocock impeccable` | `callstackincubator/agent-skills pbakaus/impeccable` |
| Go | `go design mermaid pocock security` | `Facta-Dev/beautifulgo trailofbits/skills-curated` |
| Notes | `pocock mermaid` | (empty) |

Leave out `github` and `playwright`: cloud sessions have their own GitHub access, and the Playwright MCP server needs a browser the VM may not have.

## Check it worked

In a new session in that environment, run `/context` or ask Claude to list its skills. If packs are missing, ask Claude to show `~/.claude/gautier-skills-setup.log`.

The setup script runs once per environment, then the result is cached for about seven days. After changing `PACKS`, save the environment again so the script reruns.

# Packs in cloud sessions

Cloud sessions don't install plugins that a repo's `.claude/settings.json` enables. They do run an environment's setup script before Claude starts, and they keep what it writes to `~/.claude`. So each cloud environment acts as a skill profile: create one environment per kind of work, and pick it when you start a session.

## Set up an environment

At claude.ai/code, add or edit an environment, open **Setup script**, and paste this. Change only the profile name on the last line. Keep network access at **Limited** (the default), which reaches GitHub.

```bash
#!/bin/bash
git clone --depth 1 https://github.com/gvannest/gautier-skills.git /tmp/gautier-skills || exit 0
PROFILE=notes bash /tmp/gautier-skills/cloud/setup.sh
```

## Profiles

Each profile is a file in [`profiles/`](profiles/) that lists its packs and the extra marketplaces those packs need. `claude-plugins-official` is always added.

Core profiles hold what a kind of work always needs. Extras are single packs to add only where they help.

| `PROFILE` | Packs | Kind |
|---|---|---|
| `go` | go, security, mermaid | core |
| `react-native` | callstack, vercel, react, mermaid | core |
| `notes` | pocock, mermaid | core |
| `pocock` | pocock | extra |
| `design` | design | extra |
| `impeccable` | impeccable | extra |
| `mermaid` | mermaid | extra |

Combine them by listing names in quotes. Each pack installs once. Since an environment's packs are fixed, make one environment per combination you use, and pick it when you start a session:

| Environment | `PROFILE` |
|---|---|
| Go | `"go"` |
| Go + design | `"go design pocock"` |
| React Native | `"react-native"` |
| React Native + design | `"react-native impeccable design pocock"` |
| Notes | `"notes"` |

To add a profile, add a `profiles/<name>.env` file with `PACKS` and `EXTRA_MARKETPLACES`, then use that name in an environment.

Leave out `github` and `playwright`: cloud sessions have their own GitHub access, and the Playwright MCP server needs a browser the VM may not have.

## Check it worked

In a new session in that environment, ask Claude to list its skills. If packs are missing, ask Claude to show `~/.claude/gautier-skills-setup.log`.

## When a profile changes

The setup script runs once per environment, and the result is cached for about seven days. A change to a profile file reaches an environment only when that cache is rebuilt. To rebuild it now, edit the environment's setup script (adding a comment such as `# v2` is enough), save, and start a new session.

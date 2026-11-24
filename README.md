# gautier-skills

My agent skills, published as a Claude Code plugin marketplace. Each skill set is a pack, and each project turns on only the packs it needs.

## Packs

Own skills:

| Pack | Skills |
|---|---|
| `design` | architecture-workbench, engineering-design, gautier-high-level-design, gautier-implement-feature |
| `react` | react-best-practices |
| `mermaid` | mermaid-diagrams, plus a diagrams-first rule (see below) |

Third-party skills, always fetched from their authors (nothing is copied here):

| Pack | What it pulls in | Extra marketplace to declare |
|---|---|---|
| `pocock` | `mattpocock-skills@claude-plugins-official` | none |
| `railway` | `railway@claude-plugins-official` | none |
| `security` | `openai-security-best-practices`, `openai-security-ownership-map` from Trail of Bits | `skills-curated` → `trailofbits/skills-curated` |
| `callstack` | Callstack's building, migrating and testing React Native plugins | `callstack-agent-skills` → `callstackincubator/agent-skills` |
| `playwright` | `playwright@claude-plugins-official` (Microsoft's Playwright MCP server) | none |
| `vercel` | Vercel's web skills: react-best-practices (React/Next.js performance), composition-patterns, web-design-guidelines | none |
| `vercel-react-native` | Vercel's react-native-skills, composition-patterns | none |
| `nextjs` | Official Next.js workflow skills from `vercel/next.js/skills`: cache components and partial prefetching (adoption + optimizer), bundle optimizer, dev loop | none |
| `impeccable` | `impeccable@impeccable` (Paul Bakaus's frontend design skill) | `impeccable` → `pbakaus/impeccable` |
| `pstack` | `pstack@cursor-plugins` (Lauren Tan's workflow + engineering-principle skills and agents) | `cursor-plugins` → `cursor/plugins` |
| `github` | `github@claude-plugins-official` (GitHub MCP server, needs `GITHUB_PERSONAL_ACCESS_TOKEN`) | none |
| `context7` | Upstash Context7 MCP server (up-to-date library docs) at `https://mcp.context7.com/mcp`. Sends `CONTEXT7_API_KEY` when set (higher rate limits), anonymous otherwise. Declared here rather than depending on `context7@claude-plugins-official`, whose URL requires an OAuth sign-in | none |
| `postgres` | Timescale's pg-aiguide `postgres` router skill (its topics load on demand: table design, migrations, schema exploration, hybrid and vector search, TimescaleDB, PostGIS) + docs search MCP server (`mcp.tigerdata.com`) | none |

### Diagrams-first rule

The `mermaid` pack also carries two hooks ([`plugins/mermaid/hooks/`](plugins/mermaid/hooks/)) that tell the agent to explain with Mermaid diagrams first and use text only to support them. Short facts, code changes and yes/no answers are the exceptions. The rule also makes the agent pick the diagram type from the question (sequence for interactions, state for lifecycles, Gantt for schedules, ER for data models, and so on) and load the `mermaid-diagrams` skill, instead of drawing a flowchart by default.

| Hook | When | What it injects |
|---|---|---|
| `SessionStart` | startup, resume, `/clear`, after compaction | the full rule |
| `UserPromptSubmit` | every message you send | a one-line reminder, so the rule stays near the end of the context |

The pack is enabled at user scope on the laptop, so the rule applies in every local repo. Every core cloud profile includes `mermaid`. Mermaid shows up as raw source in a plain terminal, so the rule suits the desktop app and claude.ai better than the bare CLI.

An eval suite in [`plugins/mermaid/evals/`](plugins/mermaid/evals/) checks both sides of the rule: an explanation gets a Mermaid block, while a short fact, a yes/no answer, a commit message and a code edit don't. Two more cases check the type choice: an OAuth login gets a `sequenceDiagram`, a migration plan a `gantt`. Rerun it after changing the rule:

```bash
claude plugin eval plugins/mermaid -j 8
```

Each case runs with and without the pack. Expect every case at 1.00 with the pack, and `explanation` at 0.00 without it: that gap is the hooks at work.

## Adding a pack

| The author publishes | Add to this repo |
|---|---|
| A Claude plugin in their own marketplace | A bundle: `plugins/<pack>/.claude-plugin/plugin.json` with `dependencies: [{name, marketplace}]`, an entry in `marketplace.json`, and their marketplace name in `allowCrossMarketplaceDependenciesOn` |
| Skill folders only | A `marketplace.json` entry with a `git-subdir` source pointing at their folder |
| Your own skill | The skill folder under `plugins/<pack>/skills/` |

Then run `claude plugin validate .`, push, and add a `cloud/profiles/<pack>.env` if cloud sessions need it.

MCP servers travel the same way: a plugin can carry them (as `github`, `playwright` and `postgres` do), or a pack can hold just a `.mcp.json`.

A bundle installs its dependencies only when their marketplace is known, so declare the extra marketplace in the same settings file.

## Use in a project

Add to the project's `.claude/settings.json`, keeping only the packs it needs:

```json
{
  "extraKnownMarketplaces": {
    "gautier-skills": {
      "source": { "source": "github", "repo": "gvannest/gautier-skills" }
    },
    "skills-curated": {
      "source": { "source": "github", "repo": "trailofbits/skills-curated" }
    }
  },
  "enabledPlugins": {
    "design@gautier-skills": true,
    "mermaid@gautier-skills": true,
    "security@gautier-skills": true
  }
}
```

Claude Code offers to install the packs once you trust the folder. Skills appear with their pack as a prefix, such as `/design:engineering-design`.

Or install one by hand:

```bash
claude plugin marketplace add gvannest/gautier-skills
claude plugin install design@gautier-skills --scope project
```

## Updating

Packs don't pin a `version`, so each push to `main` is a new version.

- **Local**: add `"autoUpdate": true` to each marketplace under `extraKnownMarketplaces`, and Claude Code updates packs in the background, applied on `/reload-plugins` or the next session. To update right away: `claude plugin marketplace update gautier-skills`, then `claude plugin update <pack>@gautier-skills --scope <scope>`.
- **Cloud**: see [cloud/README.md](cloud/README.md#when-a-profile-changes). Environments pick up new commits when their setup reruns.

## Secrets for MCP packs

Packs reference keys by variable name only; values never go in this repo.

| Variable | Pack | Laptop | Cloud |
|---|---|---|---|
| `CONTEXT7_API_KEY` (optional) | context7 | `env` block of `~/.claude/settings.json` | environment's **Environment variables** |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | github | `env` block of `~/.claude/settings.json` | not used in cloud |

The desktop app doesn't read shell files like `.zshrc`, so put laptop values in `~/.claude/settings.json`.

## Codex

Codex reads the same marketplace file:

```bash
codex plugin marketplace add gvannest/gautier-skills
codex plugin add design@gautier-skills
```

Codex ignores plugin `dependencies`, so the bundle packs install empty there. Install the upstream plugin directly instead, such as `codex plugin add mattpocock-skills@claude-plugins-official`. Codex plugins apply everywhere, not per project.

## License

MIT.

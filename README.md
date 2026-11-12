# gautier-skills

My agent skills, published as a Claude Code plugin marketplace. Each skill set is a pack, and each project turns on only the packs it needs.

## Packs

Own skills:

| Pack | Skills |
|---|---|
| `design` | architecture-workbench, engineering-design, gautier-design-slice, gautier-high-level-design, gautier-implement-slice |
| `react` | react-best-practices |
| `mermaid` | mermaid-diagrams |

Third-party skills, always fetched from their authors (nothing is copied here):

| Pack | What it pulls in | Extra marketplace to declare |
|---|---|---|
| `pocock` | `mattpocock-skills@claude-plugins-official` | none |
| `railway` | `railway@claude-plugins-official` | none |
| `security` | `openai-security-best-practices`, `openai-security-ownership-map` from Trail of Bits | `skills-curated` → `trailofbits/skills-curated` |
| `callstack` | Callstack's building, migrating and testing React Native plugins | `callstack-agent-skills` → `callstackincubator/agent-skills` |
| `go` | `beautiful-go@beautiful-go` | `beautiful-go` → `Facta-Dev/beautifulgo` |
| `playwright` | `playwright@claude-plugins-official` (Microsoft's Playwright MCP server) | none |
| `vercel` | Vercel's react-best-practices, composition-patterns, react-native-skills, web-design-guidelines | none |
| `impeccable` | `impeccable@impeccable` (Paul Bakaus's frontend design skill) | `impeccable` → `pbakaus/impeccable` |
| `github` | `github@claude-plugins-official` (GitHub MCP server, needs `GITHUB_PERSONAL_ACCESS_TOKEN`) | none |

A bundle installs its dependencies only when their marketplace is known, so declare the extra marketplace in the same settings file.

## Use in a project

Add to the project's `.claude/settings.json`, keeping only the packs it needs:

```json
{
  "extraKnownMarketplaces": {
    "gautier-skills": {
      "source": { "source": "github", "repo": "gvannest/gautier-skills" }
    },
    "beautiful-go": {
      "source": { "source": "github", "repo": "Facta-Dev/beautifulgo" }
    }
  },
  "enabledPlugins": {
    "design@gautier-skills": true,
    "mermaid@gautier-skills": true,
    "go@gautier-skills": true
  }
}
```

Claude Code offers to install the packs once you trust the folder. Skills appear with their pack as a prefix, such as `/design:engineering-design`.

Or install one by hand:

```bash
claude plugin marketplace add gvannest/gautier-skills
claude plugin install design@gautier-skills --scope project
```

## Codex

Codex reads the same marketplace file:

```bash
codex plugin marketplace add gvannest/gautier-skills
codex plugin add design@gautier-skills
```

Codex ignores plugin `dependencies`, so the bundle packs install empty there. Install the upstream plugin directly instead, such as `codex plugin add mattpocock-skills@claude-plugins-official`. Codex plugins apply everywhere, not per project.

## License

MIT, except vendored files under `plugins/design/skills/gautier-design-slice/assets/review/vendor/`, which keep their own licenses.

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
| `playwright-cli` | Microsoft's `skills/playwright-cli` (needs `npm i -g @playwright/cli`) | none |
| `vercel` | Vercel's react-best-practices, composition-patterns, react-native-skills, web-design-guidelines | none |

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

## License

MIT, except vendored files under `plugins/design/skills/gautier-design-slice/assets/review/vendor/`, which keep their own licenses.

# gautier-skills

My agent skills, published as a Claude Code plugin marketplace. Each skill set is a pack, and each project turns on only the packs it needs.

## Packs

| Pack | Skills |
|---|---|
| `design` | architecture-workbench, engineering-design, gautier-design-slice, gautier-high-level-design, gautier-implement-slice |
| `react` | react-best-practices |
| `mermaid` | mermaid-diagrams |

## Use in a project

Add to the project's `.claude/settings.json`, keeping only the packs it needs:

```json
{
  "extraKnownMarketplaces": {
    "gautier-skills": {
      "source": { "source": "github", "repo": "gvannest/gautier-skills" }
    }
  },
  "enabledPlugins": {
    "design@gautier-skills": true,
    "mermaid@gautier-skills": true
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

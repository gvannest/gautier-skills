# Plan: per-project skills via plugin marketplace

Goal: one public repo (`Gvanns/gautier-skills`) = Claude Code marketplace. Own skills as packs; third-party skills as thin bundles pointing upstream. Each project enables only its packs. Cloud via setup script. No global skills.

Facts (docs, 2026-11-12):
- Repo `.claude/settings.json` `extraKnownMarketplaces` + `enabledPlugins` work locally (after folder trust). NOT installed in cloud sessions.
- Cloud loads repo `.claude/skills/` + claude.ai-account skills only.
- Bundle plugin = `plugin.json` with only `dependencies`. Cross-marketplace deps need `allowCrossMarketplaceDependenciesOn` in our `marketplace.json`.
- Marketplace name `agent-skills` reserved → use `gautier-skills`.

## Phase 0: cleanup ✅
- [x] mermaid-diagrams real dir → `~/.agents/skills`; `~/.codex/skills/mermaid-diagrams` symlinks to it
- [x] Trashed figma, figma-implement-design, imagegen, planning, react-nextjs-best-practices, playwright-interactive (+ codex links) → `~/.Trash/skills-removed-2026-11-12`

Manual test: Claude Code + Codex list mermaid-diagrams; removed skills gone.

## Phase 1: repo + own packs
- [x] `.claude-plugin/marketplace.json` (name `gautier-skills`, owner Gvanns)
- [x] Pack `design`: architecture-workbench, engineering-design, gautier-design-slice, gautier-high-level-design, gautier-implement-slice
- [x] Pack `react`: react-best-practices
- [x] Pack `mermaid`: mermaid-diagrams
- [x] Copy (not move) skills in; originals stay until Phase 3
- [x] `claude plugin validate .` (marketplace + 3 packs pass)
- [x] README + LICENSE (MIT)
- [x] Push to `gvannest/gautier-skills` (public; gh login is `gvannest`)

Manual test: `claude plugin marketplace add ~/gautier-skills`; `claude plugin install design@gautier-skills`; skills listed with `design:` prefix.

## Phase 2: upstream bundles
- [ ] `pocock` → dep `mattpocock-skills@claude-plugins-official`
- [ ] `railway` → dep `railway@claude-plugins-official`
- [ ] `security` → deps `openai-security-best-practices`, `openai-security-ownership-map` @ `skills-curated` (trailofbits/skills-curated, CC-BY-SA-4.0)
- [ ] `playwright` → `git-subdir` microsoft/playwright-cli `skills/playwright-cli` (no Claude plugin upstream; needs `npm i -g @playwright/cli`)
- [ ] `vercel` → no Claude plugin upstream (vercel-labs/agent-skills = `npx skills` only). `git-subdir` per skill: `skills/react-best-practices`, `skills/composition-patterns`, `skills/web-design-guidelines`, `skills/react-native-guidelines` (upstream renamed from vercel-react-native-skills). Skip vercel/vercel-plugin (38 skills + hooks + MCP + telemetry)
- [ ] `callstack` → deps on marketplace `callstack-agent-skills` (callstackincubator/agent-skills): `building-react-native-apps`, `migrating-to-react-native`, `testing-react-native-apps` (github-actions). validate-skills + writing-user-docs dropped (trashed)
- [ ] `go` → dep `beautiful-go@beautiful-go` (Facta-Dev/beautifulgo)
- [ ] `allowCrossMarketplaceDependenciesOn`: `claude-plugins-official`, `skills-curated`, `callstack-agent-skills`, `beautiful-go`
- [ ] Check: deps on non-default marketplaces need them registered too (project `extraKnownMarketplaces`?)

Manual test: install `pocock@gautier-skills` → `claude plugin list` shows `mattpocock-skills@claude-plugins-official`; one git-subdir pack installs and its skill loads.

## Phase 3: per-project local config
- [ ] Snippet for project `.claude/settings.json` (marketplace + enabled packs)
- [ ] Roll out to one React project, one Go project
- [ ] Remove replaced copies from `~/.agents/skills` (keep `codebase-memory`: managed by codebase-memory-mcp)

Manual test: React project lists only react/vercel packs; Go project only go pack; new folder lists none.

## Phase 4: Codex
- [ ] Check Codex marketplace format vs `.claude-plugin/marketplace.json` (Matt's repo serves both → see how)
- [ ] `codex plugin marketplace add Gvanns/gautier-skills`
- [ ] Remove `~/.codex/skills` symlinks

Manual test: Codex lists packs; skills run.

## Phase 5: cloud setup script (experiment)
- [ ] Repo commits `.claude/skill-packs` (one pack per line)
- [ ] Env setup script: clone gautier-skills (+ upstreams), copy listed skills into VM `~/.claude/skills`
- [ ] One test session

Manual test: cloud session lists exactly the packs in `.claude/skill-packs`. Unknowns: script sees clone? VM `~/.claude/skills` loaded?

## Phase 6: descriptions + manual-only
- [ ] Scope in each own skill description
- [ ] `disable-model-invocation: true` on niche own skills
- [ ] Upstream skills untouched

Manual test: React session doesn't suggest RN skills; niche skills only via `/name`.

## Decided
- playwright: Microsoft's skill, not skills-curated `openai-playwright`
- playwright-interactive: dropped
- Packs: `design` / `react` / `mermaid`

- Callstack validate-skills + writing-user-docs: dropped

## Unresolved
- Non-official dep marketplaces must be declared per project? (Phase 2)
- Codex reads Claude marketplace format? (Phase 4)

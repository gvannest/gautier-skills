---
name: react-best-practices
description: Core React correctness and design rules, ordered by importance. Use when writing, refactoring or reviewing React components, hooks, state or effects (.jsx/.tsx), even when the user does not say "best practices". For Next.js/bundle performance tuning use vercel-react-best-practices; for React Native use react-native-best-practices.
---

# React best practices

Rules ranked by impact: bugs first, then maintainability, then performance.
When writing code, apply them top-down. When reviewing, report violations
with the rule number and stop nitpicking below rule 12 unless asked.

## Correctness (bugs)

1. **Rules of Hooks.** Call hooks only at the top level of components or
   `useX` hooks. Never inside conditions, loops, callbacks or after an early
   return.
2. **No state mutation.** Never `push`, `splice`, `sort` or assign into state.
   Make new objects/arrays (`[...a, x]`, `map`, `filter`, `{...o, k: v}`).
3. **Pure render.** Render computes JSX from props/state only. No fetches,
   subscriptions, DOM writes, `setState` or random values in the render body.
4. **You might not need an effect.** Derive values during render. Run
   user-triggered logic in event handlers. `useEffect` is only for syncing
   with external systems (network, DOM, subscriptions, timers).
5. **Correct effect deps.** List every reactive value used. Never silence
   `react-hooks/exhaustive-deps`; restructure instead (move the function
   inside the effect, use functional updates, or hoist constants).
6. **Effect cleanup.** Return a cleanup that unsubscribes, clears timers and
   aborts fetches (`AbortController` or an `ignore` flag) to avoid leaks and
   races.
7. **Stable keys.** Use IDs from data. Never use the array index for lists
   that reorder, filter or insert, and never `Math.random()`.
8. **No stale closures.** When the next state depends on the previous one,
   use `setX(prev => ...)`.
9. **No components defined inside components.** They remount every render
   and lose state. Define at module level.
10. **Safe HTML.** No `dangerouslySetInnerHTML` with unsanitized input.
11. **Falsy rendering.** `{count && <X/>}` renders `0`. Use `count > 0 &&`
    or a ternary.

## Design (maintainability)

12. **Minimal state, single source of truth.** Don't store what you can
    compute. Don't copy props into state. Lift shared state to the closest
    common parent.
13. **Right state home.** Local state first. Server data in a fetching
    library (TanStack Query, SWR) or framework loaders, not hand-rolled
    `useEffect` + `useState`. Context for rarely changing global values.
14. **Small, focused components; composition over config.** Split when a
    component does more than one thing. Prefer `children` and composition
    over boolean-prop explosion.
15. **Custom hooks for reused stateful logic.** Name them `useX`. They share
    logic, not state.
16. **Error boundaries and Suspense** around risky or async subtrees so one
    failure doesn't blank the page.
17. **Accessible markup.** Semantic elements (`button`, `label`, `nav`),
    keyboard support, ARIA only when HTML can't express it.

## Performance (only when it matters)

18. **Don't memoize by default.** Trust React Compiler if enabled. Otherwise
    add `memo`/`useMemo`/`useCallback` only for measured problems or to keep
    references stable for memoized children / effect deps.
19. **Stable Context values.** Memoize Provider `value` objects, and split
    Contexts by update frequency.
20. **Avoid fetch waterfalls.** Start independent requests in parallel or
    higher in the tree.
21. **Big lists and heavy routes.** Virtualize long lists; lazy-load routes
    and heavy components.

## Tooling assumed

`eslint-plugin-react-hooks` on, `<StrictMode>` in dev. Its double-render and
double-effect behavior is a feature: fix the code, don't remove StrictMode.

# Local Markdown review app

Both design workflows open this viewer automatically when invoked. A separate request for a rendered review is unnecessary.
The existing slice/round workflow still owns design agreement and document status.
Ending the viewer does not approve the design or mark a round done.

## Runtime

Node.js 20 or newer and a modern browser. Browser renderers are bundled locally; runtime needs no npm install or network.
The bundle uses Mermaid Tiny 12.3.0, Marked and DOMPurify. Standard flowchart, sequence, class, state, ER and C4 diagrams render offline.
Tiny omits mindmap, architecture-beta, KaTeX math and the ELK engine; layouts use its Dagre fallback instead.
Resolve `<skill-dir>` from the skill's installed location. Use absolute document and session paths.
The helper serves only the chosen document and its local image assets. It does not edit the Markdown.

## Agent loop

1. Write/update the Markdown. Start a session:

   ```sh
   node <skill-dir>/scripts/review.mjs start /absolute/path/R1-design.md
   ```

   The JSON result includes `url` and `directory`. Open that URL in the available browser, or give the developer the link.
   Use the same server throughout the review conversation. Its page follows the browser's light/dark preference.

2. Wait for a batch or an end event:

   ```sh
   node <skill-dir>/scripts/review.mjs wait /absolute/session/directory
   ```

   Run as a long-running tool command. Yield and resume using the harness's process tools; keep the agent turn active.
   The local server cannot independently awaken an already-ended chat or invoke an arbitrary coding harness.
   No provider key, embedded agent process, or harness-specific plugin is needed.

3. For `type: comments`, read each comment's target and authoritative context.
   The batch names the document path, raw-source SHA-256 hash, review round and batch ID.
   Text offsets count UTF-16 characters in each boundary block's rendered text, not raw Markdown characters.
   Diagram IDs/ordinals refer only to the included source snapshot. Never relocate them into a newer version by guessing.
   Check current source before editing. If it changed, reconcile against the reviewed context and the current file.
   Prefer focused edits that preserve unaffected sections. Answer questions in the conversation as appropriate.

4. After finishing the edits, acknowledge this batch and publish the complete revision:

   ```sh
   node <skill-dir>/scripts/review.mjs publish /absolute/session/directory --batch BATCH_ID
   ```

   This works even when feedback required no document edit. It clears the consumed batch and starts a clean review round.
   Repeat `wait`. A repeated wait before publication returns the same batch; it does not consume or duplicate it.
   While the batch is pending, the UI shows that the agent is updating and keeps its feedback durably saved.

5. For `type: ended`, finish cleanup:

   ```sh
   node <skill-dir>/scripts/review.mjs stop /absolute/session/directory
   ```

   End review stops the server. Its end receipt remains readable by `wait` after shutdown until `stop` removes owned files.
   Close the review tab when the browser tools allow; otherwise leave its ended message for the developer.
   If the developer tells you in chat to stop instead, use `stop`; pending work requires an explicit send/discard decision.
   Use `--discard` only when discarding is explicitly requested. Markdown and reusable app files remain intact.

## Recovery and boundaries

- Saved comments live in the session directory and survive browser refresh or server interruption.
  Resume with `start SAME_DOCUMENT --session-dir SAME_DIRECTORY`; open the newly returned URL.
- A composer draft is also kept per browser tab. Unsaved edits are restored after a page refresh.
- External source changes mark the review outdated and block sending. The reviewed snapshot stays visible.
  The developer can reload it; discarding saved pending comments requires confirmation.
- A failed send retains the batch/draft. Retrying the same send request does not enqueue another batch.
- Session startup uses a single-writer lock; use a new empty directory or an existing owned session.
- Review targets are implemented and tested for flowchart nodes/edges and sequence participants/messages.
  Other Mermaid families render, but element-level comments are not promised for every family.
- Only one document is loaded per session. Relative image assets within its directory are supported;
  navigating a feature's linked Markdown files is not implemented in this pilot.

## Verification and renderer maintenance

Run the helper's public-contract tests (some open loopback listeners):

```sh
node --test <skill-dir>/scripts/*.test.mjs
```

`scripts/review-browser-check.js` and `review-browser-regressions.js` are Playwright `run-code` functions for disposable fixtures.
The first uses `examples/review-demo.md`; the regression fixture adds `USD to USD.` and uses CRLF line endings.
They exercise real UI actions and leave test comments, so use dedicated test sessions.

To intentionally update the bundled renderer dependencies, use the pinned package manifest and lockfile:

```sh
cd <skill-dir>/assets/review
npm ci --ignore-scripts
npm run build
npm run test:build
```

The resulting `vendor/` files and license notices are runtime assets. `node_modules/` is not distributed with the app.
The build replaces the generated directory, removing obsolete chunks. Runtime tests enforce its file-count and byte budget;
the separate build test checks deterministic output after installing development dependencies.

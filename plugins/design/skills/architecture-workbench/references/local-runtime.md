# Local workspace and lifecycle

This is the standard packaging and launcher contract across projects, independent of the explorer's implementation stack.
The package commands may wrap the implementation appropriate for the project; a particular frontend or server framework is not required.

## Project-local workspace

Resolve the repository's persistent main checkout and place the application under its `.local/architecture-workbench/`.
When the agent runs in a temporary or linked worktree, use the shared repository metadata and worktree inventory to locate that checkout.
Do not use the agent's current worktree merely because it is the working directory; the app must survive temporary worktree removal.
The main checkout is the permanent project directory; this does not require changing its checked-out branch.
If no persistent checkout can be identified, ask the user for the intended directory rather than guessing or creating one elsewhere.
The source being analyzed may remain in a worktree. Record that source checkout and snapshot separately from the app's permanent location.
Keep its source, architecture inventory, built assets, dependencies, lockfiles and runtime state within that workspace.
Inspect an existing workbench before updating it; preserve its evidence, configuration and user review records.
When migrating an existing artifact, verify the new location before removing the old copy or replacing its running server.

Reuse an existing ignore rule when it covers the directory. Otherwise add a narrowly scoped local Git exclusion for this workspace.
Verify the actual application paths are ignored and absent from tracked files; an ignore pattern does not untrack existing files.
If the application is already tracked, report that fact rather than silently removing it from version control.
Do not stage or push the generated application unless the user explicitly requests publication.
The reusable skill itself can remain versioned separately from the local artifacts it generates.

Include a `package.json` with `private: true`. Scope its dependencies and installation to the workbench directory.
Use the project's suitable implementation capabilities; avoid changing the main application's dependencies for the workbench launcher.
Include a lockfile when installing package dependencies. Document any separate prerequisites the wrapped implementation needs.
If the package-command runtime is unavailable, report the missing prerequisite rather than claiming the launcher works.

## Standard commands

From the persistent main checkout root:

```text
npm --prefix .local/architecture-workbench start
npm --prefix .local/architecture-workbench stop
npm --prefix .local/architecture-workbench run status
```

Equivalently, enter `.local/architecture-workbench/` and run `npm start`, `npm stop` or `npm run status`.
Implement these scripts in the package; do not merely list suggested commands in documentation.

| Command | Required behavior |
| --- | --- |
| start | Launch the workbench in the background and return after verifying readiness; report its address and process identity. |
| stop | Shut down only the verified matching workbench instance, wait for shutdown, and report port release or remaining conflict. |
| status | Report running, stopped or an unmanaged listener, with address and verified process identity when available. |

Repeated start reports the existing matching instance without creating a duplicate.
Repeated stop succeeds without signalling any process when the workbench is already stopped.
Status is read-only; it does not start a server or silently delete stale records.
Explain that closing a browser tab or terminal does not stop this background server; the stop command releases the port.
Use local loopback only. Offer an explicit port setting, defaulting to 4173 when it is available, and report the actual address.
If the requested port belongs to another instance or application, report the conflict and leave it untouched.

## Instance identity and process safety

Associate each instance with the canonical workbench directory, port, process identity and a unique instance identifier.
Keep runtime metadata and logs in a private subdirectory such as `.runtime/`, separate from browser-served assets.
Protect instance identifiers and control endpoints from being exposed by the static file server.
Verify the live instance matches the recorded directory and instance identifier before shutdown.
An authenticated request asking that server to stop itself avoids trusting a PID that may have been reused.
An equivalent mechanism is acceptable only when it provides the same instance-ownership guarantee.

Never kill whichever process occupies a port, or signal a PID solely because it appears in a saved file.
Stale or forged metadata must not authorize stopping another application.
Serialize concurrent lifecycle mutations; a failed startup must release control locks and report a useful error/log location.
Document recovery for a control lock left by an interrupted launcher, without automatically terminating an unverified process.
Stopping preserves source, configuration, inventories and review records. Existing browser notes remain associated with their origin.

## Verification and handoff

Use isolated temporary ports for lifecycle checks and leave unrelated services untouched.

- Start serves the actual app, returns control and confirms readiness; starting again does not spawn a duplicate.
- Status reports the correct live address and distinguishes stopped from unmanaged listeners.
- Stop releases the managed listener; starting again works, and stopping an absent instance is safe.
- A foreign listener remains usable after rejected start/stop attempts, including when metadata contains a stale or forged PID.
- Runtime metadata and shutdown controls are inaccessible to ordinary unauthenticated browser requests.
- Concurrent or failed starts cannot leave conflicting ownership records or silently claim another instance.
- The application is ignored, no generated files were accidentally staged, and the main application's dependencies are unchanged.
- The actual application directory is in the persistent main checkout, not in the agent worktree or behind a link to one.
- After a move, restart from the permanent directory and verify that runtime ownership records identify that canonical path.
- The build works from the new location when a build step exists, and the browser loads the workbench from its reported address.

Deliver the local path, exact start/stop/status commands, current running state and address, and verification results.
Keep a short local usage document with prerequisite, port-setting, log and interrupted-launcher recovery instructions.

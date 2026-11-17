# Brixwall

Monorepo. Two apps and a test kit, one product.

```
Brixwall/
  server/    Express 5 API over the local Docker socket — see server/CLAUDE.md
  client/    React 19 SPA, the game-style wall — see client/CLAUDE.md
  test/      Shell scripts that spawn, shake and clean up test containers — see "Test kit"
  api/       API docs, one file per module — see "Workflow"
  sessions/  Daily session logs, local only — see "Session logs"
```

`server/CLAUDE.md` and `client/CLAUDE.md` hold the enforceable rules for those apps. Read the one for the code you are touching. This file holds the rules that apply across apps and the product context.

---

## Product context

Brixwall turns the containers on your machine into **a live pixel-art brick wall**, styled like a side-scrolling platformer. Every container is one brick. Start a container and a crate parachutes down into the wall; stop it and the brick goes grey; remove it and the brick falls out. When every container is healthy, the flag at the end of the level goes up.

It is a **local developer tool, open source (MIT), free.** It runs on the developer's own machine next to Docker. No accounts, no cloud, no database.

- Do not invent features, entities, screens, or endpoints that were not asked for.
- When the domain is unclear, stop and ask. A wrong assumption baked into the API contract costs days.
- Every feature is: agree on the contract → service → controller → route → API doc → frontend. In that order.

### Domain

| Thing | What it is |
|---|---|
| **Container** | One Docker container, any state. Keyed by its 12-char short `id`. Shape in `api/containers.md`. |
| **Snapshot** | The full container list + summary + `dockerOnline`, pushed over SSE whenever anything changes. |
| **Brick** | The client's drawing of one container in the wall. Colour from the container name, status dot from `state` / `health`. |
| **Wall progress** | `healthy / total` from the snapshot summary. |
| **Flag** | Raised when `summary.allHealthy` is true. |

### Hard rules

- **Read-only towards Docker in v1.** The server only issues `GET` calls to the Docker Engine API. No start, stop, remove, exec or pull from Brixwall. Controlling containers is a v2 decision and needs Manish's go-ahead.
- **Local only.** The server binds to `127.0.0.1` by default. Access to the Docker socket is root-equivalent on the host, so Brixwall is never exposed on a public interface, and the README says so.
- **Never leak container secrets.** Container env vars, command args and mount sources are not returned by the API. Logs are returned only on explicit request for one container.
- **Docker being down is a normal state, not a crash.** The server keeps running, the stream reports `dockerOnline: false`, and the client shows an offline scene.

### Brand and trademark rules (open source, so these matter)

- **No Docker trademarks as ours.** Never use the Docker name in the product name, logo or tagline, and never draw the Docker whale. "Works with Docker" in the README is fine. Bricks use our own crate icon.
- **No characters, art, music or levels from existing games.** The look is a generic 16-bit platformer, but the hero, enemies, tiles and sounds are original. The hero is a dock worker with a yellow hard hat and a crate backpack. Never a red-cap plumber, never a recognisable sprite.
- No competitor names in copy, titles or metadata.

### v1 scope

In:
- Live wall from the SSE stream, sorted oldest container at the bottom.
- Parachute drop on new container, grey brick on stop, falling brick on remove, recolour on health change.
- Wall progress panel, all-healthy flag, Docker offline state.
- A controllable hero (walk, jump) that walks in front of the wall.
- Click a brick → container details. Logs panel for one container.

Out (do not build until asked):
- Starting, stopping or removing containers from the UI.
- Remote Docker hosts, Kubernetes, multiple hosts.
- Auth, accounts, persistence, history over time.
- Sound.

### Build order

1. Server: config, logger, Docker socket client, health, containers (list, detail, logs, SSE stream). **Done 2026-11-17, session 1.**
2. Test kit: `test/spawn.sh`, `test/chaos.sh`, `test/cleanup.sh`. **Done 2026-11-17, session 1.**
3. Client shell: Vite + React + Tailwind, config module, stream hook. **Done 2026-11-17, session 2.**
4. Wall scene: sky, ground, stone wall frame, bricks from the stream. **Done 2026-11-17, session 2.**
5. Motion: parachute drop, brick fall, status recolour, flag raise. **Done 2026-11-17, session 2.**
6. Hero: keyboard movement and jump. **Done 2026-11-17, session 2.**
7. Brick details card, Containers panel and Logs panel. **Done 2026-11-17, session 2.**
8. README with screenshots/GIF, publish.

Update this list as steps land, with the date and session file.

### Open decisions

Ask Manish before building anything that depends on these:
- How the Brixwall logo looks (the pixel crate is a placeholder mark).

Settled 2026-11-17: Zustand for client state, TanStack Query for one-off GETs, DOM + CSS bricks with canvas-generated pixel sprites.

---

## Design language (client)

**16-bit pixel platformer, bright daytime level.** Reference: the "Container Wall Adventure" mockup Manish shared (sky, clouds, grass ledges, stone wall frame, coloured cargo bricks, flag pole on the right, speech bubble from the hero, parachute crates). Match its mood and layout. Do not copy any game's sprites.

- **Pixel-perfect rendering.** `image-rendering: pixelated`, integer scaling, no blur, no anti-aliased sprite edges.
- **Fonts:** a pixel font for headings and the speech bubble, a clean sans for the HUD numbers and labels. Both from Google Fonts.
- **Bricks** are cargo-container shaped with ribs, a name label, and a status dot top-right: green running and healthy, amber starting, red unhealthy, grey stopped.
- **Brick colours** come from a fixed palette (orange, purple, pink, green, blue, yellow, teal), picked by a stable hash of the container name, so a brick keeps its colour across reloads.
- **HUD** sits on dark navy rounded pills over the sky: logo top-left, nav tabs centre, health pill top-right, wall progress card under the logo.
- **Motion** respects `prefers-reduced-motion`: drops and falls become instant placement.

---

## Golden rules (all apps)

1. **No comments. Anywhere.** No inline, no block, no JSDoc, no `TODO`, no banner headers, no commented-out code. Names carry the meaning. If a line needs a comment, rewrite the line or extract a well-named function. This applies to config files and shell scripts too.
2. **Think before writing.** Before any non-trivial change, state: what the contract is, what endpoints/components it touches, what can break. If you cannot answer those, you are not ready to write.
3. **Production quality only.** No `console.log`, no placeholder logic, no "we'll fix it later", no dead code, no unused exports, no swallowed errors. Every path has a defined success shape and a defined failure shape.
4. **Match the surrounding code.** Same idioms, same structure, same naming as the file you are in. Do not introduce a new pattern to solve a problem an existing pattern already solves.
5. **No unrequested scope.** No abstractions, no libraries, no config, no "while I was here" refactors unless asked. Do the thing that was asked, well.
6. **Small steps.** One concern per change. Slow and correct beats fast and broad.

---

## Stack (fixed)

| Layer | Choice |
|---|---|
| Runtime | Node.js ≥ 22, ES Modules (`"type": "module"`) |
| API | Express 5 |
| Docker access | Docker Engine API over the Unix socket, plain `node:http`. **No `dockerode`.** |
| Live updates | Server-Sent Events (`text/event-stream`). **No socket.io, no WebSockets.** |
| Database | **None.** Docker is the source of truth. No MongoDB, PostgreSQL or Redis. |
| Validation | Zod 4 |
| Logging | winston |
| Frontend | React 19, Vite 8, Tailwind 4 |
| Client state | Zustand (`client/src/store/wall.store.js`) |
| Server state | TanStack Query for one-off GETs; the live wall comes from the SSE stream |
| Icons | lucide-react (UI and per-container icons) |
| Test kit | Bash, compatible with macOS bash 3.2 (no `mapfile`, no associative arrays) |

---

## Test kit (`test/`)

- Every container the scripts create carries the label `brixwall.test=true` and a `brixwall-` name prefix. Scripts only ever touch containers with that label, never anything else on the machine.
- Image is a pinned `alpine` tag running `sleep infinity`, with a mix of passing healthchecks, failing healthchecks and none, so every brick state shows up.
- `spawn.sh [count] [delaySeconds]`, `chaos.sh [rounds] [delaySeconds]`, `cleanup.sh [delaySeconds]`.

---

## Environment & secrets

- Real values live only in `server/.env` and `client/.env`, both gitignored. Every app has an `.env.example` with every key.
- Every env var is read once, in a single config module per app (`server/src/config/index.js`, `client/src/config/`). Nothing else reads `process.env` / `import.meta.env` directly.
- Defaults: API `http://127.0.0.1:3000`, client `http://localhost:5173`.

---

## Workflow

- New feature or non-trivial change → write a short plan, wait for Manish to confirm, then build.
- Backend before frontend for any given feature. If a change spans apps, land the API first, then the client against it.
- **Only `GET` and `POST`.** No `PUT`, `PATCH`, `DELETE`, anywhere, ever.
- **API docs are mandatory.** Every module has `api/<module>.md`. Adding or changing a route is not done until that file is updated in the same change. `api/README.md` is the index + conventions.

---

## Session logs — MANDATORY

`sessions/` holds one Markdown file per day: `sessions/YYYY-MM-DD.md`. It is the running memory of what happened and why. It is local only and gitignored, never committed.

**At the start of every session:** read the latest `sessions/*.md` file(s) before doing anything else.

**At the end of every session**, and whenever Manish says "wrap up" / "session over" / "likh do", create or append to `sessions/<today>.md`. If a session changed anything, the log gets written. Multiple sessions in one day append a new `## Session N — <title>` block, never overwriting an earlier one.

Each block covers:

- **Goal** — what this session set out to do.
- **Done** — what actually changed, with file paths. Facts, not intentions.
- **Decisions** — any call made and the reason, especially ones not obvious from the code.
- **Open / next** — what is unfinished, what the next session should pick up, known issues.

Keep it terse and factual. It is a handoff note, not a diary. `sessions/_template.md` is the shape to follow.

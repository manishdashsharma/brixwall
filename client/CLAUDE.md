# Brixwall — Frontend

React 19 · Vite 8 · Tailwind 4

Read `../CLAUDE.md` first. This file is the enforceable frontend spec. The API contract is `../api/containers.md`.

---

## Absolute rules

- **No comments of any kind.** No inline, no block, no JSDoc, no commented-out code.
- **No `console.log`** in committed code.
- **Live data comes from the SSE stream. Only.** The wall is driven by `GET /v1/containers/stream`. Never poll `GET /v1/containers` on an interval.
- **One place does HTTP.** All requests and the `EventSource` are created in `src/config/` / the stream hook. No scattered `fetch` calls in components.
- **Tailwind for styling.** No CSS files beyond `index.css`, no CSS-in-JS. Inline `style={{}}` only for genuinely dynamic values (brick position, fall offset, parachute progress).
- **Every async view has three states:** loading, error, empty. The wall also has a fourth: Docker offline (`dockerOnline: false`).
- **No Docker whale, no existing game characters or sprites.** See the brand rules in the root CLAUDE.md.
- Function components only. Hooks at the top. No class components.
- Single quotes, semicolons, 2-space indent, ESM.

---

## Directory layout

```
src/
  config/
    env.js              Reads import.meta.env once. Only file that touches it.
  app/
    App.jsx             Providers + top-level layout only.
  features/
    wall/
      components/       Wall, Brick, Parachute, Flag, WallProgress.
      hooks/            useContainerStream (EventSource + diffing).
      lib/              Brick colour hash, wall layout maths.
    hero/
      components/       Hero sprite.
      hooks/            useHeroControls (keyboard, physics).
    containers/
      components/       Brick details popover, Logs panel.
  components/
    ui/                 Reusable presentational pieces (Pill, Panel, Button).
    layout/             HUD top bar, scene shell.
  lib/
    cn.js               className merge helper.
  index.css             `@import "tailwindcss";`, theme tokens, pixel font.
  main.jsx              createRoot. No logic here.
```

A feature never imports from another feature's internals. Shared code moves up to `components/` or `lib/`.

---

## File & symbol naming

| Thing | Pattern | Example |
|---|---|---|
| Component file | PascalCase `.jsx` | `Brick.jsx` |
| Component | PascalCase, named function, default export | `export default function Brick() {}` |
| Hook file | camelCase `.js`, `use` prefix | `useContainerStream.js` |
| Feature folder | lowercase | `features/wall/` |

One component per file. The file is named after the component.

---

## Live stream

- `useContainerStream` opens one `EventSource` to `${env.apiUrl}/v1/containers/stream` and listens for `snapshot` events. It closes the source on unmount.
- Each snapshot is the **full list**. Diff by `id` against the previous one:
  - id is new → drop it in on a parachute
  - id is gone → brick falls out, then remove it
  - `state` or `health` changed → recolour the status dot / grey out the brick
- `EventSource` reconnects on its own. Show a small reconnecting hint on `error`, do not build a manual retry loop.
- Keep containers ordered by `createdAt` (the server already sends them that way) so bricks never jump around.

---

## Components

- Presentational components take props and render. No data access beyond a passed callback.
- Lists use the container `id` as `key`, never the array index.
- Extract a component when a block is reused or exceeds ~50 lines of JSX. Not before.

---

## Motion

- Animate transforms (`translate`, `scale`, `rotate`), not layout properties.
- Every animation honours `prefers-reduced-motion`: drops and falls become instant.
- Sprites render with `image-rendering: pixelated` at integer scale.

---

## Open decisions

Ask Manish before building anything that depends on these (also listed in the root CLAUDE.md):
- State library: Zustand (as in Colabrix) or React state only.
- Whether TanStack Query is used for the one-off GETs (details, logs) or a plain helper in `src/config/`.
- DOM + CSS bricks with a canvas background, or the whole scene on canvas.

---

## Do NOT

- Add comments or `console.log`.
- Poll the list endpoint for live updates.
- Use the Docker whale or any existing game's art.
- Read `import.meta.env` outside `src/config/env.js`.
- Add libraries that were not agreed.

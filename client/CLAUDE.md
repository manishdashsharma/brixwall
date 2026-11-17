# Brixwall — Frontend

React 19 · Vite 8 · Tailwind 4 · Zustand · TanStack Query

Read `../CLAUDE.md` first. This file is the enforceable frontend spec. The API contract is `../api/containers.md`.

---

## Absolute rules

- **No comments of any kind.** No inline, no block, no JSDoc, no commented-out code.
- **No `console.log`** in committed code.
- **The live wall comes from the SSE stream. Only.** `useContainerStream` feeds the Zustand store from `GET /v1/containers/stream`. Never poll `GET /v1/containers`.
- **One-off reads are TanStack Query hooks** in `features/<feature>/api/`. No `useEffect` + `fetch` in components.
- **One place does HTTP.** `src/config/api.js` (`apiGet`, `streamUrl`) is the only code that calls `fetch` or builds API URLs. It unwraps the `{ success, data }` envelope and throws an `Error` with the server's message.
- **Client state lives in Zustand** (`src/store/wall.store.js`): snapshot, bricks with their animation phase, selection, active tab. No server data from TanStack Query is copied into it.
- **Tailwind for styling.** Tokens, keyframes and the `pixelated` / `brick-ribs` utilities live in `index.css`. No other CSS files, no CSS-in-JS. Inline `style={{}}` only for genuinely dynamic values (brick position and size, hashed brick colour, animation delay, tile sprite URLs).
- **Every async view has three states:** loading, error, empty. The wall also has offline states (server unreachable, Docker down), shown through `WallNotice`.
- **No Docker whale, no existing game characters or sprites.** See the brand rules in the root CLAUDE.md.
- Function components only. Hooks at the top. No class components.
- Single quotes, semicolons, 2-space indent, ESM.

---

## Directory layout

```
src/
  config/
    env.js              Reads import.meta.env once. Only file that touches it.
    api.js              apiGet + streamUrl. Only file that does HTTP.
    query.js            QueryClient + defaults.
  app/
    App.jsx             Providers only.
    GameScreen.jsx      Composes the scene, HUD and panels; reads the store.
  store/
    wall.store.js       useWallStore: snapshot, bricks, selection, tabs.
  features/
    scenery/components/ Sky, Foliage, Ground, Ledge. Decorative only.
    wall/
      components/       Wall, Brick, Parachute, GhostSlot, WallNotice, Flag, WallProgress.
      hooks/            useContainerStream (EventSource → store).
      lib/              wallLayout (columns, brick size, slot positions).
    hero/
      components/       Hero, SpeechBubble.
      hooks/            useHeroControls (keyboard, physics, rAF loop).
    containers/
      api/              useContainer, useContainerLogs.
      components/       ContainerDetails, ContainersPanel, LogsPanel, DetailRow.
  components/
    ui/                 PixelSprite, Panel, StatusDot, Icon.
    layout/             TopBar.
  hooks/                useElementSize.
  lib/                  cn, sprites, tileStyle, brickColors, containerStatus, wallStatus,
                        mergeBricks, format.
  index.css             Tailwind import, @theme tokens and keyframes, utilities.
  main.jsx              createRoot. No logic here.
```

A feature never imports from another feature's internals. Shared code moves up to `components/`, `hooks/` or `lib/`.

---

## File & symbol naming

| Thing | Pattern | Example |
|---|---|---|
| Component file | PascalCase `.jsx` | `Brick.jsx` |
| Component | PascalCase, named function, default export | `export default function Brick() {}` |
| Hook file | camelCase `.js`, `use` prefix | `useContainerStream.js` |
| Query hook | `use<Resource>` | `useContainer`, `useContainerLogs` |
| Zustand store | `<name>.store.js`, hook `use<Name>Store` | `wall.store.js` → `useWallStore` |
| Lib / hook exports | named exports at the bottom | `export { mergeBricks };` |

One component per file. The file is named after the component.

---

## Live wall

- Each snapshot is the **full list**. `mergeBricks` diffs it by `id` against the current bricks:
  - new id → `phase: 'dropping'` with a `dropDelay` (staggered on first load) → parachute drop
  - missing id → `phase: 'falling'` → brick falls, then `removeBrick` on `animationend`
  - same id → data refreshed, phase kept (a falling brick that comes back is placed again)
- Brick order follows the snapshot (`createdAt`, oldest at the bottom). New bricks append.
- `Brick` listens for `animationend` on its own wrapper only (`event.target === event.currentTarget`) so the parachute's animation never ends the drop.
- `EventSource` reconnects on its own. `onerror` sets `connection: 'reconnecting'`; no manual retry loop.
- `wallStatus` turns store state into the health pill, the hero's speech bubble and the wall notice. Add new states there, not in components.

---

## Query keys

| Hook | Key | Refresh |
|---|---|---|
| `useContainer(id)` | `['containers', id]` | 5 s |
| `useContainerLogs(id, tail)` | `['containers', id, 'logs', tail]` | 4 s |

---

## Sprites

- Pixel art is defined as character grids in `lib/sprites.js` and painted to a canvas once at import, then used as data URLs. Every row in a grid must be the same length.
- Render sprites with `PixelSprite` (integer `scale`) or `tileStyle(sprite, scale)` for repeating tiles. Always keep the `pixelated` utility on them.
- The hero is 14×20: yellow hard hat, orange vest, blue crate backpack. Keep it original.

---

## Motion

- Animate transforms only. Brick reflow uses a `left` / `bottom` transition.
- `prefers-reduced-motion`: drop, fall and parachute animations collapse to 1 ms (so `animationend` still fires and the store advances); drifting clouds and bobbing stop.

---

## Do NOT

- Add comments or `console.log`.
- Poll the list endpoint for live updates.
- Call `fetch` outside `src/config/api.js`, or read `import.meta.env` outside `src/config/env.js`.
- Put TanStack Query data into the Zustand store.
- Use the Docker whale or any existing game's art.
- Add libraries that were not agreed.

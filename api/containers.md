# Containers & Health API

Base URL: `http://127.0.0.1:3000/v1`. No auth. The server binds to `127.0.0.1` because it holds the Docker socket; never expose it publicly.

Every JSON response has this envelope:

```json
{ "success": true, "statusCode": 200, "message": "...", "data": { } }
```

Errors use the same envelope with `success: false` and `data: null`. Docker being down returns **503** with `"Docker is not running. Start Docker and try again."`.

---

## Container object

| Field | Type | Notes |
|---|---|---|
| `id` | string | 12-char short id. Stable key for a brick. |
| `name` | string | Container name, no leading `/`. |
| `image` | string | e.g. `redis:7-alpine` |
| `state` | string | `running` · `exited` · `created` · `paused` · `restarting` · `dead` · `removing` |
| `status` | string | Human text from Docker, e.g. `Up 5 minutes (healthy)` |
| `health` | string \| null | `healthy` · `unhealthy` · `starting` · `null` (no healthcheck) |
| `ports` | array | `[{ publicPort, privatePort, type }]`, published ports only |
| `project` | string \| null | Compose project label |
| `service` | string \| null | Compose service label |
| `createdAt` | ISO string | List is sorted by this, oldest first (bottom of the wall). |

## Summary object

| Field | Type | Notes |
|---|---|---|
| `total` | number | All containers, any state |
| `running` | number | `state === 'running'` |
| `healthy` | number | Running and `health` is `null` or `healthy` |
| `allHealthy` | boolean | `total > 0 && healthy === total`. Raises the flag. |

---

## `GET /containers/stream` (live, use this for the wall)

Server-Sent Events. Open with `new EventSource('/v1/containers/stream')`.

- Sends one `snapshot` event right away, then another **only when something changes** (container added/removed, state or health change, Docker up/down). Docker is polled every `DOCKER_POLL_INTERVAL_MS` (2 s).
- A `: ping` comment every 15 s keeps the connection open; `EventSource` ignores it.
- `EventSource` reconnects on its own if the server restarts.

```js
const source = new EventSource('http://127.0.0.1:3000/v1/containers/stream');
source.addEventListener('snapshot', (event) => {
  const snapshot = JSON.parse(event.data);
});
```

Event payload (not wrapped in the envelope):

```json
{
  "dockerOnline": true,
  "message": null,
  "containers": [ { "id": "70644be5e37b", "name": "rightday-redis", "state": "running", "health": "healthy" } ],
  "summary": { "total": 3, "running": 3, "healthy": 3, "allHealthy": true }
}
```

When Docker is down: `dockerOnline: false`, `message` explains why, `containers: []`.

Each snapshot is the full list. Diff it by `id` on the client: new id → parachute drop, missing id → brick falls, changed `state`/`health` → recolour.

## `GET /containers`

One-off list, same data as a snapshot.

`data`: `{ containers: Container[], summary: Summary }`

## `GET /containers/:id`

`:id` is a short id, full id or name. Invalid format → 400, unknown → 404.

`data` is the container itself:

```json
{
  "id": "70644be5e37b",
  "name": "rightday-redis",
  "image": "redis:7-alpine",
  "state": "running",
  "health": "healthy",
  "exitCode": 0,
  "restartCount": 0,
  "ports": [{ "publicPort": 6379, "privatePort": 6379, "type": "tcp" }],
  "networks": ["rightday_default"],
  "project": "rightday",
  "service": "redis",
  "createdAt": "2026-11-16T09:27:11.048Z",
  "startedAt": "2026-11-17T15:17:21.469Z",
  "finishedAt": null
}
```

`startedAt` / `finishedAt` are `null` when Docker has never set them.

## `GET /containers/:id/logs?tail=200`

| Query | Type | Default | Range |
|---|---|---|---|
| `tail` | integer | 200 | 1–1000 |

`data`: `{ logs: [{ stream: 'stdout' | 'stderr', timestamp: string | null, message: string }] }`, oldest first.

## `GET /health`

`data`: `{ status: 'healthy' | 'degraded', docker: 'online' | 'offline', timestamp, uptime, environment, version }`. Always 200; read `docker` to show an offline banner.

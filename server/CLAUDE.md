# Brixwall — Backend

Express 5 · ES Modules · Docker Engine API over the Unix socket · SSE · Zod 4 · winston

Read `../CLAUDE.md` first. This file is the enforceable backend spec. Manish's global standards apply; where this file is more specific, this file wins.

---

## Absolute rules

- **No comments of any kind.** See root CLAUDE.md rule 1.
- **No `console.log`.** Use `logger`.
- **No database.** No mongoose, Prisma, Redis or any datastore. Docker is the source of truth.
- **No `dockerode` or other Docker SDK.** Every Docker call goes through `dockerRequest` in `src/shared/docker/docker.js`.
- **Read-only towards Docker.** `dockerRequest` only sends `GET`. Do not add `POST` calls to Docker (start, stop, kill, remove, exec, pull) until Manish asks.
- **Only `GET` and `POST` routes.** Never `PUT`, `PATCH`, `DELETE`.
- **Independent async calls run in `Promise.all`.** Never `await` them in sequence. Dependent calls (inspect, then read logs by its `Tty` flag) stay sequential.
- **`no-param-reassign` is on.** Always use intermediate variables.
- Max line length 100. Single quotes. Semicolons. 2-space indent. ESM only.

---

## Directory layout

```
src/
  config/
    index.js            Single config object. Only file that reads process.env.
  shared/
    index.js            Barrel: re-exports middleware, utils, logger, docker.
    constant/           App-wide enums (E-prefixed).
    docker/docker.js    Docker socket client: dockerRequest, pingDocker.
    middleware/         error-handler (errorHandler, notFoundHandler, asyncHandler), validate.
    utils/              logger, response helpers.
  modules/
    <name>/
      controllers/<name>.controller.js
      services/<name>.service.js
      routes/<name>.route.js
      validations/<name>.schema.js
      index.js          exports { <name>Routes } and re-exports the module's parts
  router/index.js       Mounts every module under /v1.
  app.js                Express wiring only.
  server.js             Boot, listen, graceful shutdown. The ONLY shutdown handler.
```

Current modules: `health` (`GET /v1/health`), `containers` (`GET /v1/containers`, `/stream`, `/:id`, `/:id/logs`). Contract in `../api/containers.md`.

---

## Module contract

Every feature is a module under `src/modules/<name>/` with these files. `index.js`:

```js
export { default as <name>Routes } from './routes/<name>.route.js';
export * from './controllers/<name>.controller.js';
export * from './services/<name>.service.js';
export * from './validations/<name>.schema.js';
```

Register it in `src/router/index.js`:

```js
router.use('/<name>', <name>Routes);
```

A module with no input to validate (like `health`) has no `validations/` folder and no `services/` folder if it has no logic beyond the controller.

---

## Naming

| Thing | Pattern | Example |
|---|---|---|
| Service fn | `<verb><Resource>Service` | `listContainersService`, `getContainerLogsService` |
| Controller fn | `<verb><Resource>` | `listContainers`, `streamContainers` |
| Zod schema | `<verb><Resource>Schema` | `getContainerSchema` |
| Route file | `<name>.route.js` | `containers.route.js` |
| Enum | `E` prefix | `EApplicationEnvironment` |

Exports: **named exports at the bottom of the file.** Zod schemas are the exception: `export const xSchema = ...` inline.

---

## Layer responsibilities

### Route

Wiring only. No logic. `validateRequest(schema, source) → controller`. No auth exists: Brixwall is local only.

```js
router.get('/:id', validateRequest(getContainerSchema, 'params'), getContainer);
```

Static paths (`/stream`) are registered before parameter paths (`/:id`).

### Controller

HTTP in, HTTP out. No Docker calls, no business logic. Reads the request, calls one service, shapes the response, logs.

```js
const getContainer = asyncHandler(async (req, res) => {
  try {
    const container = await getContainerService(req.params.id);
    return httpResponse(req, res, 200, responseMessage.SUCCESS.FETCHED, container);
  } catch (error) {
    logger.error('Get container failed', {
      error: error.message,
      stack: error.stack,
      containerId: req.params.id,
      requestId: req.requestId,
    });
    return httpError(req, res, error, error.statusCode || 500);
  }
});
```

### Service

All business logic and all Docker access. Pure async functions. No `req` / `res`.

- Map every Docker payload to our own shape before returning it. Never pass a raw Docker object through: field names, secrets and size all leak otherwise.
- Never return container `Env`, `Cmd` / `Args`, mount sources or labels other than the Compose project and service.
- Throw plain `Error` with `.statusCode` for expected failures. Let unexpected errors bubble.
- No `try/catch` just to log-and-rethrow. Catch only when you add real handling (the poller turning a 503 into an offline snapshot is real handling).

---

## Docker client (`shared/docker/docker.js`)

- `dockerRequest(path, { query, raw })` talks to `config.docker.socketPath` with `config.docker.timeoutMs`. It returns parsed JSON, or a `Buffer` when `raw: true` (logs, `_ping`).
- It already maps failures to user-facing errors. Services do not re-map them:
  - socket missing / refused → **503** "Docker is not running. Start Docker and try again."
  - socket permission denied → **503**
  - timeout → **504**, Docker 404 → **404** "Container not found", other Docker 4xx/5xx → **502**
- Path segments built from user input are always passed through `encodeURIComponent`.
- `pingDocker()` returns a boolean and never throws.

---

## Live stream (SSE)

- One shared poller in `containers.service.js`, not one per client. It starts with the first subscriber and stops when the last one leaves. It uses a `setTimeout` chain so polls never overlap.
- A snapshot is broadcast **only when its signature changes**: container ids, names, `state`, `health` and `dockerOnline`. The `status` text ("Up 5 minutes") is excluded so it does not push every minute.
- A new subscriber gets the last snapshot immediately.
- Docker down → snapshot with `dockerOnline: false`. Any other poll error keeps the last good snapshot and logs, so a transient error never empties the wall.
- The controller sends `event: snapshot` frames plus a `: ping` heartbeat every 15 s, and unsubscribes on `req` `close`.
- `app.js` skips compression for `Accept: text/event-stream`; compression buffers and would stall the stream. Keep that filter.
- Shutdown in `server.js` calls `stopContainersWatchService()` and `server.closeAllConnections()`, because open streams would otherwise hold `server.close()` forever.

---

## Error handling

Expected failure inside a service:

```js
const error = new Error('Container not found');
error.statusCode = 404;
throw error;
```

What the client sees is decided by `publicError` (`shared/utils/response.js`): a message reaches the client only on a **4xx**, or when the error carries an explicit `statusCode` (the deliberate 503/504/502 from the Docker client). Anything else becomes "Something went wrong on our side. Please try again." with the real message logged as `cause`.

The controller `catch` calls `httpError(req, res, error, error.statusCode || 500)`. The global `errorHandler` is the final net.

---

## Response shape

`httpResponse(req, res, status, message, data)` produces:

```json
{ "success": true, "statusCode": 200, "message": "...", "data": <object|null> }
```

`data` is **always a plain object** (or `null`). Never an array, never a scalar.

- **Single resource**: `data` **is** the resource (`data.id`, `data.name`). Do not wrap it.
- **Collection**: `data: { <name>: [ ... ] }`, plus siblings when needed (`summary`, `pagination`). `GET /containers` returns `{ containers, summary }`; logs return `{ logs }`.
- **SSE frames** are the one exception: they carry the bare snapshot, not the envelope.
- **Never** pass `{ data: ... }` yourself. Never double-wrap.

---

## Validation

- One `.schema.js` per module. Zod 4. `export const <verb><Resource>Schema = z.object({ ... })` inline.
- `validateRequest(schema, source)` where `source` is `'body'`, `'query'` or `'params'`. It parses, replaces the request slice with the parsed value, and returns 400 on failure.
- Container `:id` must match `^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$` (short id, full id or name).
- Coerce query params (`z.coerce.number()`) and give them defaults and bounds (`tail` 1–1000, default 200).

---

## Logging

- `logger` from `shared/index.js` (winston). Coloured console in development, JSON + `logs/` files in production.
- Structured metadata on every call: `{ requestId, containerId, ...context }`.
- `logger.info` on meaningful state changes (stream opened/closed, Docker reachable/unreachable), `logger.error` with `{ error: error.message, stack: error.stack }` in every controller catch.
- Never log container log lines, env vars or full Docker payloads.

---

## Config

- `src/config/index.js` is the only place `process.env` is read.
- Keys: `NODE_ENV`, `HOST` (default `127.0.0.1`), `PORT` (default `3000`), `CORS_ORIGIN` (default `http://localhost:5173`), `LOG_LEVEL`, `DOCKER_SOCKET_PATH` (default `/var/run/docker.sock`), `DOCKER_TIMEOUT_MS` (5000), `DOCKER_POLL_INTERVAL_MS` (2000). All have defaults, so nothing is required at boot.
- Every key is listed in `.env.example`.

---

## Do NOT

- Add comments, JSDoc, or `TODO`s.
- Add `console.log`.
- Add `PUT` / `PATCH` / `DELETE` routes.
- Add a database, cache, queue or Docker SDK.
- Send anything but `GET` to Docker.
- Call `dockerRequest` from a controller.
- Return raw Docker payloads, env vars or command args.
- Bind to `0.0.0.0` by default.
- Start a poller per SSE client.
- Double-wrap the response `data`.

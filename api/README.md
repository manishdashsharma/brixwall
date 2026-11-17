# Brixwall API

Base URL: `http://127.0.0.1:3000/v1`. Local only, no auth.

| Module | Doc | Routes |
|---|---|---|
| Health | [containers.md](containers.md#get-health) | `GET /health` |
| Containers | [containers.md](containers.md) | `GET /containers`, `GET /containers/stream`, `GET /containers/:id`, `GET /containers/:id/logs` |

## Conventions

- Only `GET` and `POST`. No `PUT`, `PATCH`, `DELETE`.
- Every JSON response: `{ success, statusCode, message, data }`. `data` is an object or `null`, never an array.
- Single resource: `data` is the resource. Collection: `data: { <name>: [...] }` with siblings such as `summary`.
- Errors: same envelope, `success: false`, `data: null`, a message a user can act on.
- SSE frames carry the bare payload, not the envelope.
- Adding or changing a route is not done until its doc here is updated in the same change.

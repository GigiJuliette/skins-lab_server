# API Reference

Base URL: `http://localhost:3000` (or the `PORT` you configured).

**Authentication:** Items endpoints require a JWT. Register or login to get a token, then send it in the `Authorization: Bearer <token>` header.

---

## Auth API

### POST /api/auth/register

Create a new user account.

**Request body** (JSON):

- `email` (string, required)
- `password` (string, required, min 6 characters)

**Response** (201 Created):

```json
{
  "user": { "id": 1, "email": "user@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret123"}'
```

---

### POST /api/auth/login

Login and get a JWT.

**Request body** (JSON):

- `email` (string, required)
- `password` (string, required)

**Response** (200 OK): same shape as register (`user` and `token`).

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@example.com", "password": "password123"}'
```

---

## Health Check

### GET /health

Returns server status and database connectivity.

**Response** (200 OK):

```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-02-10T12:00:00.000Z"
}
```

If the database is unreachable, `database` will be `"error"` instead of `"connected"`.

**Example:**

```bash
curl http://localhost:3000/health
```

---

## Items API

**Protected:** All endpoints require `Authorization: Bearer <token>`.

CRUD operations for a simple `items` resource. Each item has:

- `id` (number, auto-generated)
- `name` (string, required)
- `description` (string or null)
- `created_at` (ISO 8601 timestamp)

### List items

**GET /api/items**

Optional query parameters:

- `limit` (default: 50, max: 100) — number of items to return
- `offset` (default: 0) — number of items to skip

**Response** (200 OK):

```json
{
  "items": [
    {
      "id": 1,
      "name": "Sample Item One",
      "description": "First example item",
      "created_at": "2025-02-10T12:00:00.000Z"
    }
  ]
}
```

**Example:**

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/items
curl -H "Authorization: Bearer <token>" "http://localhost:3000/api/items?limit=10&offset=0"
```

---

### Create item

**POST /api/items**

**Request body** (JSON):

- `name` (string, required, non-empty)
- `description` (string, optional)

**Response** (201 Created):

```json
{
  "id": 6,
  "name": "New Item",
  "description": "Optional description",
  "created_at": "2025-02-10T12:00:00.000Z"
}
```

**Error** (400 Bad Request) — missing or invalid `name`:

```json
{
  "error": "name is required and must be a non-empty string"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name": "My Item", "description": "Optional description"}'
```

---

### Get item by ID

**GET /api/items/:id**

**Response** (200 OK):

```json
{
  "id": 1,
  "name": "Sample Item One",
  "description": "First example item",
  "created_at": "2025-02-10T12:00:00.000Z"
}
```

**Errors:**

- 400 Bad Request — invalid `id` (not a number)
- 404 Not Found — no item with that ID

```json
{ "error": "Item not found" }
```

**Example:**

```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/items/1
```

---

### Update item

**PUT /api/items/:id**

**Request body** (JSON):

- `name` (string, required, non-empty)
- `description` (string, optional)

**Response** (200 OK): the updated item (same shape as get-by-id).

**Errors:**

- 400 — invalid `id` or invalid `name`
- 404 — item not found

**Example:**

```bash
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name": "Updated Name", "description": "Updated description"}'
```

---

### Delete item

**DELETE /api/items/:id**

**Response** (204 No Content) — empty body on success.

**Errors:**

- 400 — invalid `id`
- 404 — item not found

**Example:**

```bash
curl -X DELETE -H "Authorization: Bearer <token>" http://localhost:3000/api/items/1
```

---

## Error responses

- **401 Unauthorized** — missing or invalid token, or invalid credentials

- **400 Bad Request** — invalid input (e.g. missing or invalid `name`, invalid `id`)
- **404 Not Found** — resource not found (e.g. item ID does not exist)
- **500 Internal Server Error** — unexpected server or database error

Error responses use a JSON body with an `error` field when applicable.

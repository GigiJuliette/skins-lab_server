# Express Server with Docker Database

Minimal Express.js API server that connects to a PostgreSQL database running in Docker. All server code, Docker configuration, and documentation live in this directory.

## Prerequisites

- **Node.js** 18 or higher
- **Docker** and **Docker Compose** (to run the database)

## Quick Start

### 1. Configure environment

From the `server` directory, copy the example environment file and adjust if needed (defaults match the Docker Compose database):

```bash
cp .env.example .env
```

Default values in `.env.example` match `docker-compose.yml`, so you can keep them as-is for local development.

### 2. Start the database

Start PostgreSQL in the background:

```bash
docker compose up -d
```

Wait a few seconds for the database to be ready (optional: run `docker compose ps` and ensure the postgres service is healthy).

### 3. Install dependencies and seed the database

```bash
npm install
npm run seed
```

The seed script creates the `items` table and inserts sample rows.

### 4. Run the server

**Development** (with auto-restart on file changes):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

The API will be available at `http://localhost:3000` (or the port set in `.env`).

## Project Structure

```
server/
├── README.md           # This file
├── .env.example        # Example environment variables
├── docker-compose.yml  # PostgreSQL service
├── Dockerfile          # Optional: run the Express app in Docker
├── package.json
├── src/
│   ├── index.js        # Express app entry point
│   ├── db/
│   │   └── connection.js   # Database connection pool
│   ├── middleware/
│   │   └── requireAuth.js  # JWT auth for protected routes
│   ├── routes/
│   │   ├── index.js    # Central route registration
│   │   ├── health.js   # GET /health
│   │   ├── auth.js     # POST /api/auth/register, /api/auth/login
│   │   └── items.js    # CRUD /api/items (protected)
│   ├── services/
│   │   ├── items.js    # Items business logic and DB access
│   │   └── users.js    # Users and password hashing
│   └── examples/
│       └── seed.js     # Database seed script
└── docs/
    └── API.md          # API reference and examples
```

## Configuration

| Variable        | Description                                      | Default (example)                    |
|----------------|--------------------------------------------------|--------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string                     | `postgresql://dbuser:dbpassword@localhost:5432/mydb` |
| `PORT`         | HTTP server port                                 | `3000`                               |
| `JWT_SECRET`   | Secret for signing JWT tokens                    | — (required for auth)                 |
| `NODE_ENV`     | Environment (`development` / `production`)      | `development`                        |

Credentials in `docker-compose.yml` must match `DATABASE_URL` (user `dbuser`, password `dbpassword`, database `mydb`). To use different credentials, update both the Compose file and `.env`.

## Stopping Services

Stop the database containers:

```bash
docker compose down
```

To remove the database volume as well (all data will be lost):

```bash
docker compose down -v
```

## Troubleshooting

### Port 5432 already in use

Another PostgreSQL instance or service may be using port 5432. Either stop it or change the host port in `docker-compose.yml`, for example:

```yaml
ports:
  - "5433:5432"
```

Then set `DATABASE_URL` to use port `5433` on the host.

### Connection refused to database

- Ensure the database is running: `docker compose ps`
- Wait a few seconds after `docker compose up -d` for PostgreSQL to finish starting
- Check that `DATABASE_URL` in `.env` uses `localhost` and the correct port (e.g. `5432`)

### Port 3000 already in use

Set a different `PORT` in `.env`, e.g. `PORT=3001`.

## API Overview

- **Health:** `GET /health` — server and database status
- **Auth:** `POST /api/auth/register`, `POST /api/auth/login` — get JWT
- **Items:** `GET /api/items`, `POST /api/items`, `GET /api/items/:id`, `PUT /api/items/:id`, `DELETE /api/items/:id` — requires `Authorization: Bearer <token>`

See [docs/API.md](docs/API.md) for request/response examples and status codes.

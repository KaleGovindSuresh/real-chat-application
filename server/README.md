# RealChat Server

Express + Socket.IO backend for the RealChat application. It provides authentication, conversation and message APIs, upload handling, health checks, and the real-time socket transport used by the client.

## Stack

- Node.js
- TypeScript
- Express
- Socket.IO
- JSON Web Tokens
- Multer
- Cloudinary

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## Environment variables

Create `server/.env` or a project root `.env`.

```env
PORT=4000
NODE_ENV=development
JWT_SECRET=realchat_dev_secret_key_2024
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Notes:

- `CORS_ORIGIN` accepts a comma-separated list of allowed frontend origins.
- Cloudinary variables are optional. If they are missing, uploads are stored under the local `uploads/` directory and served from `/uploads`.
- `JWT_SECRET` should be replaced with a strong secret in production.

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Default local endpoints:

```text
HTTP: http://localhost:4000
WS:   ws://localhost:4000
```

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Production build and run

Compile the server:

```bash
npm run build
```

Start the compiled output:

```bash
npm run start
```

Compiled files are written to `server/dist`.

## API surface

REST routes are mounted under `/api`.

- `GET /api/health` returns status, uptime, timestamp, and environment.
- `POST /api/auth/login` authenticates an existing user.
- `POST /api/auth/register` creates a new user and returns a JWT.
- `GET /api/auth/users` returns the user list.
- `GET /api/conversations?userId=<id>` returns conversations for a user.
- `GET /api/messages/:roomId` returns room messages.
- `POST /api/upload` uploads image or video files.

## Upload behavior

- Max upload size is `50 MB`.
- Allowed MIME groups are `image/*` and `video/*`.
- With Cloudinary configured, uploads are streamed to Cloudinary under the `realchat` folder.
- Without Cloudinary configured, uploads are stored locally and exposed through `/uploads`.

## Production deployment notes

- Set `NODE_ENV=production`.
- Replace the default `JWT_SECRET`.
- Set `CORS_ORIGIN` to the production frontend origin or origins.
- Put the service behind a reverse proxy or platform load balancer if you need TLS termination.
- Persist uploaded files externally or enable Cloudinary before running multiple instances.
- The current data layer is in-memory mock data, so application data resets on restart.

## Operational checks

Use the health endpoint after deployment:

```bash
curl http://localhost:4000/api/health
```

Expected response shape:

```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2026-04-28T12:00:00.000Z",
  "environment": "production"
}
```

## Project structure

```text
src/
  config/        Environment, CORS, and Cloudinary config
  data/          In-memory mock database
  middleware/    Logging, auth, and error middleware
  routes/        REST route handlers
  socket/        Socket.IO event registration
  types/         Shared backend TypeScript types
  index.ts       App and server bootstrap
```

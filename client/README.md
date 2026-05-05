# RealChat Client

Next.js frontend for the RealChat application. It provides authentication, real-time messaging, media upload, forwarding, and persisted Redux state.

## Stack

- Next.js 15
- React 18
- TypeScript
- Redux Toolkit
- Socket.IO client
- `react-hook-form` + `yup`

## Prerequisites

- Node.js 20 or newer
- npm 9 or newer
- A running RealChat server

## Environment variables

Create `client/.env` for local development or configure the same values in your deployment platform.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=
```

- `NEXT_PUBLIC_API_BASE_URL` is used for REST requests.
- `NEXT_PUBLIC_SOCKET_URL` is optional. If omitted, the client falls back to `NEXT_PUBLIC_API_BASE_URL`.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are optional. If omitted, uploads go through the server `/api/upload` endpoint.

## Local development

```bash
npm install
npm run dev
```

Default local URL: `http://localhost:3000`

## Available scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run test:coverage
```

## Production build

```bash
npm run build
npm run start
```

The production build output is written to `.next/`.

## Deployment notes

- Set `NEXT_PUBLIC_API_BASE_URL` to your public API origin.
- Set `NEXT_PUBLIC_SOCKET_URL` only when the websocket origin differs from the API origin.
- Make sure the server `CORS_ORIGIN` allows the deployed frontend origin.
- If uploads are proxied through the server, browser Cloudinary credentials are not required.
- If you use direct browser uploads, provide both Cloudinary `NEXT_PUBLIC_*` variables.

## Project structure

```text
app/                 Next.js app router entrypoints
public/              Static assets
src/
  app/               Redux store, hooks, and providers
  components/        Reusable UI and chat components
  features/          Redux slices and validation
  hooks/             Reusable React hooks
  screens/           Top-level authenticated and auth screens
  services/          API, socket, and upload services
  types/             Shared frontend TypeScript types
  utils/             Utility helpers
```

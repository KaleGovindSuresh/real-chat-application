# RealChat Client

React + Vite frontend for the RealChat application. It handles authentication, real-time messaging, media upload, message forwarding, and Redux-persisted client state.

## Stack

- React 18
- TypeScript
- Vite
- Redux Toolkit
- Socket.IO client
- Tailwind CSS v4
- `react-hook-form` + `yup`

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- A running RealChat server

## Environment variables

Create `client/.env` for local development or provide these values through your deployment platform.

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

Notes:

- `VITE_API_BASE_URL` is used for REST requests.
- `VITE_SOCKET_URL` is optional. If omitted, the client falls back to `VITE_API_BASE_URL`.
- `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` are optional. If they are not set, uploads go through the server `/api/upload` endpoint.

## Local development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run test:coverage
```

## Production build

Create an optimized bundle:

```bash
npm run build
```

Preview the built app locally:

```bash
npm run preview
```

The production output is written to `client/dist`.

## Deployment notes

- Set `VITE_API_BASE_URL` to your public API origin, for example `https://api.example.com`.
- Set `VITE_SOCKET_URL` when your WebSocket endpoint is different from the REST API origin.
- Make sure the server `CORS_ORIGIN` includes the deployed frontend origin.
- If you use server-side upload proxying, the client does not need Cloudinary credentials.
- If you use direct Cloudinary uploads from the browser, provide `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`.

## Auth and UX behavior

- Login and registration use `react-hook-form` with `yup` validation.
- Success and failure states are surfaced through toast alerts.
- Network failures return messages such as `Unable to reach auth server at http://localhost:4000`.
- Shared UI primitives for auth live in `src/components/ui`.

## Project structure

```text
src/
  app/              Redux store and hooks
  components/       Reusable UI and chat components
  features/         Redux slices and auth validation
  hooks/            Reusable React hooks
  pages/            Top-level application screens
  services/         API, socket, and upload services
  styles/           Global styles and design tokens
  types/            Shared frontend TypeScript types
  utils/            Utility helpers
```

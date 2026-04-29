import { loadEnv } from "./config/env";
loadEnv();

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "node:path";
import type { Request, Response } from "express";

import { config } from "./config/env";
import { corsOptions } from "./config/cors";
import { requestLogger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import apiRoutes from "./routes/index";
import healthRoutes from "./routes/health";
import { registerSocketHandlers } from "./socket/handlers";

import type { ServerToClientEvents, ClientToServerEvents } from "./types";

const app = express();
const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: corsOptions,
  pingTimeout: 60_000,
  pingInterval: 25_000,
});

io.on("connection", (socket) => {
  registerSocketHandlers(io, socket);
});

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv !== "test") {
  app.use(requestLogger);
}

app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "RealChat API",
    status: "ok",
    docs: {
      health: "/health",
      apiHealth: "/api/health",
    },
    timestamp: new Date().toISOString(),
  });
});

app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use("/health", healthRoutes);
app.use("/api", apiRoutes);

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler (must be last)
app.use(errorHandler);

//Start

httpServer.listen(config.port, () => {
  console.log(`\n🚀  HTTP  → http://localhost:${config.port}`);
  console.log(`📡  WS    → ws://localhost:${config.port}`);
});

export { app, httpServer, io };

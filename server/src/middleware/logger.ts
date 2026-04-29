import type { Request, Response, NextFunction } from "express";

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

function statusColor(code: number): string {
  if (code < 300) return COLORS.green;
  if (code < 400) return COLORS.yellow;
  return COLORS.red;
}

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    const color = statusColor(res.statusCode);
    console.log(
      `${COLORS.dim}${new Date().toISOString()}${COLORS.reset} ` +
        `${COLORS.cyan}${req.method.padEnd(7)}${COLORS.reset} ` +
        `${req.originalUrl.padEnd(40)} ` +
        `${color}${res.statusCode}${COLORS.reset} ` +
        `${COLORS.dim}${ms}ms${COLORS.reset}`,
    );
  });

  next();
}

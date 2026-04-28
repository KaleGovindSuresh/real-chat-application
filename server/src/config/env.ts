import fs from 'node:fs';
import path from 'node:path';


function parseEnvValue(raw: string): string {
  const v = raw.trim();
  return (v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))
    ? v.slice(1, -1)
    : v;
}

export function loadEnv(): void {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'server/.env'),
    path.resolve(__dirname, '../../.env'),
  ];

  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;

    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const sep = line.indexOf('=');
      if (sep === -1) continue;
      const key = line.slice(0, sep).trim();
      const value = parseEnvValue(line.slice(sep + 1));
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
    return;
  }
}

// ─── Typed config ─────────────────────────────────────────────────────────────

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`[Config] Missing required environment variable: ${key}`);
  }
  return value;
}

function optional(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  corsOrigins: string[];
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

export function buildConfig(): AppConfig {
  return {
    port: parseInt(optional('PORT', '4000'), 10),
    nodeEnv: optional('NODE_ENV', 'development'),
    jwtSecret: required('JWT_SECRET', 'realchat_dev_secret_key_2024'),
    corsOrigins: (optional('CORS_ORIGIN', 'http://localhost:5173'))
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    cloudinary: {
      cloudName: optional('CLOUDINARY_CLOUD_NAME'),
      apiKey: optional('CLOUDINARY_API_KEY'),
      apiSecret: optional('CLOUDINARY_API_SECRET'),
    },
  };
}

// Singleton – imported everywhere
export const config = buildConfig();

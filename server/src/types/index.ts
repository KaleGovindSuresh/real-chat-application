export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    avatar: string;
  };
  token: string;
}

// ─── JWT payload ──────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// ─── Upload response ─────────────────────────────────────────────────────────

export interface UploadResponse {
  url: string;
  publicId: string;
  resourceType: 'image' | 'video' | 'raw';
  format: string;
  bytes: number;
}

// ─── API error ────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  code?: string;
}

export type {
  Message,
  SendMessagePayload,
  ForwardMessagePayload,
  TypingPayload,
  MarkReadPayload,
  MediaType,
} from './message';

export type { ServerToClientEvents, ClientToServerEvents } from './socket';

// src/types/index.ts — all client-side types

// Re-export shared types
export type {
  Message,
  SendMessagePayload,
  ForwardMessagePayload,
  TypingPayload,
  MarkReadPayload,
  MediaType,
} from "./message";
export type { ServerToClientEvents, ClientToServerEvents } from "./socket";

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

// ─── Conversation ─────────────────────────────────────────────────────────────

export interface Participant {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

export interface LastMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  type: "text" | "image" | "video";
}

export interface Conversation {
  id: string;
  name: string;
  participants: string[];
  participantUsers: Participant[];
  lastMessage?: LastMessage;
  updatedAt: string;
  createdAt: string;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  resource_type: "image" | "video" | "raw";
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  original_filename: string;
}

import type {
  Message,
  SendMessagePayload,
  ForwardMessagePayload,
  TypingPayload,
  MarkReadPayload,
} from "./message";

export interface ServerToClientEvents {
  new_message: (msg: Message) => void;
  user_typing: (payload: TypingPayload) => void;
  user_stopped_typing: (payload: TypingPayload) => void;
  message_forwarded: (msg: Message) => void;
  user_online: (payload: { userId: string }) => void;
  user_offline: (payload: { userId: string }) => void;
  room_joined: (payload: { roomId: string; userId: string }) => void;
  error: (payload: { message: string }) => void;
}

export interface ClientToServerEvents {
  join_room: (payload: { roomId: string }) => void;
  leave_room: (payload: { roomId: string }) => void;
  send_message: (payload: SendMessagePayload) => void;
  typing_start: (payload: TypingPayload) => void;
  typing_stop: (payload: TypingPayload) => void;
  forward_message: (payload: ForwardMessagePayload) => void;
  mark_read: (payload: MarkReadPayload) => void;
}

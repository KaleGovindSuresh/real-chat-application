import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { db } from "../data/mockDB";
import type {
  ServerToClientEvents,
  ClientToServerEvents,
  SendMessagePayload,
  ForwardMessagePayload,
  TypingPayload,
  MarkReadPayload,
} from "../types";
import type { Message } from "../types";

type IO = Server<ClientToServerEvents, ServerToClientEvents>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

/** userId → socketId map for online presence */
const onlineUsers = new Map<string, string>();

export function registerSocketHandlers(io: IO, socket: TypedSocket): void {
  const userId = socket.handshake.auth.userId as string | undefined;
  const userName = socket.handshake.auth.userName as string | undefined;

  // ── Connect: presence + auto-join ──────────────────────────────────────────
  if (userId) {
    onlineUsers.set(userId, socket.id);
    db.setUserOnline(userId, true);
    socket.broadcast.emit("user_online", { userId });

    for (const conv of db.getConversationsByUser(userId)) {
      socket.join(conv.id);
    }

    console.log(`[Socket] ${userName ?? userId} connected (${socket.id})`);
  }

  // ── join_room ──────────────────────────────────────────────────────────────
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
    io.to(roomId).emit("room_joined", { roomId, userId: userId ?? socket.id });
    console.log(`[Socket] ${userName ?? userId} joined ${roomId}`);
  });

  // ── leave_room ─────────────────────────────────────────────────────────────
  socket.on("leave_room", ({ roomId }) => {
    socket.leave(roomId);
    console.log(`[Socket] ${userName ?? userId} left ${roomId}`);
  });

  // ── send_message ───────────────────────────────────────────────────────────
  socket.on("send_message", (payload: SendMessagePayload) => {
    const message: Message = {
      id: uuidv4(),
      roomId: payload.roomId,
      senderId: payload.senderId,
      senderName: payload.senderName,
      senderAvatar: payload.senderAvatar,
      content: payload.content,
      type: payload.type,
      mediaUrl: payload.mediaUrl,
      mediaType: payload.mediaType,
      isForwarded: false,
      timestamp: new Date().toISOString(),
      readBy: [payload.senderId],
    };

    db.addMessage(message);
    db.updateConversationLastMessage(payload.roomId, message);
    io.to(payload.roomId).emit("new_message", message);

    console.log(
      `[Socket] msg → ${payload.roomId}: "${payload.content.slice(0, 50)}"`,
    );
  });

  // ── forward_message ────────────────────────────────────────────────────────
  socket.on("forward_message", (payload: ForwardMessagePayload) => {
    const original = db.getMessageById(payload.messageId);
    if (!original) {
      socket.emit("error", { message: "Original message not found" });
      return;
    }

    const forwardedBy = db.getUserById(payload.forwardedBy);

    const forwarded: Message = {
      id: uuidv4(),
      roomId: payload.toRoomId,
      senderId: payload.forwardedBy,
      senderName: payload.forwardedByName,
      senderAvatar: forwardedBy?.avatar,
      content: original.content,
      type: original.type,
      mediaUrl: original.mediaUrl,
      mediaType: original.mediaType,
      isForwarded: true,
      originalSenderId: original.senderId,
      originalSenderName: original.senderName,
      timestamp: new Date().toISOString(),
      readBy: [payload.forwardedBy],
    };

    db.addMessage(forwarded);
    db.updateConversationLastMessage(payload.toRoomId, forwarded);
    io.to(payload.toRoomId).emit("message_forwarded", forwarded);

    console.log(
      `[Socket] forwarded ${payload.fromRoomId} → ${payload.toRoomId}`,
    );
  });

  // ── typing_start / typing_stop ─────────────────────────────────────────────
  socket.on("typing_start", (payload: TypingPayload) => {
    socket.to(payload.roomId).emit("user_typing", payload);
  });

  socket.on("typing_stop", (payload: TypingPayload) => {
    socket.to(payload.roomId).emit("user_stopped_typing", payload);
  });

  // ── mark_read ──────────────────────────────────────────────────────────────
  socket.on("mark_read", (payload: MarkReadPayload) => {
    db.markMessagesRead(payload.roomId, payload.messageIds, payload.userId);
  });

  // ── disconnect ─────────────────────────────────────────────────────────────
  socket.on("disconnect", () => {
    if (userId) {
      onlineUsers.delete(userId);
      db.setUserOnline(userId, false);
      socket.broadcast.emit("user_offline", { userId });
      console.log(`[Socket] ${userName ?? userId} disconnected`);
    }
  });
}

/** Returns current online user IDs (useful for debugging / admin routes) */
export function getOnlineUsers(): string[] {
  return Array.from(onlineUsers.keys());
}

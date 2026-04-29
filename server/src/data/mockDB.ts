/**
 * src/data/mockDB.ts
 * In-memory store. Swap this module for a real DB adapter
 * without changing any route or socket handler code.
 */

import { v4 as uuidv4 } from "uuid";
import type { Message } from "../types";

//  Interfaces ──

export interface DBUser {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  isOnline: boolean;
  createdAt: string;
}

export interface DBConversation {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
  createdAt: string;
}

//  Seed data ─

const HASHED_PW =
  "$2a$10$dvpw.6pUhUWem3ZS.oxzceyHhQK/Dwt6vnoGePtALASVFyMvTpDuO"; // password123

const users: DBUser[] = [
  {
    id: "user-1",
    username: "Alice Johnson",
    email: "alice@example.com",
    password: HASHED_PW,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    isOnline: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-2",
    username: "Bob Smith",
    email: "bob@example.com",
    password: HASHED_PW,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    isOnline: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-3",
    username: "Charlie Brown",
    email: "charlie@example.com",
    password: HASHED_PW,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    isOnline: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-4",
    username: "Diana Prince",
    email: "diana@example.com",
    password: HASHED_PW,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
    isOnline: false,
    createdAt: new Date().toISOString(),
  },
];

const conversations: DBConversation[] = [
  {
    id: "room-1",
    name: "Alice & Bob",
    participants: ["user-1", "user-2"],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "room-2",
    name: "Alice & Charlie",
    participants: ["user-1", "user-3"],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "room-3",
    name: "Bob & Charlie",
    participants: ["user-2", "user-3"],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "room-4",
    name: "Alice & Diana",
    participants: ["user-1", "user-4"],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "room-5",
    name: "Team Chat",
    participants: ["user-1", "user-2", "user-3", "user-4"],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
];

const messages: Message[] = [
  {
    id: uuidv4(),
    roomId: "room-1",
    senderId: "user-1",
    senderName: "Alice Johnson",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    content: "Hey Bob! How are you doing?",
    type: "text",
    isForwarded: false,
    timestamp: new Date(Date.now() - 3_600_000).toISOString(),
    readBy: ["user-1", "user-2"],
  },
  {
    id: uuidv4(),
    roomId: "room-1",
    senderId: "user-2",
    senderName: "Bob Smith",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    content: "I'm great! Working on that new project. How about you?",
    type: "text",
    isForwarded: false,
    timestamp: new Date(Date.now() - 3_500_000).toISOString(),
    readBy: ["user-1", "user-2"],
  },
  {
    id: uuidv4(),
    roomId: "room-1",
    senderId: "user-1",
    senderName: "Alice Johnson",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    content: "Same here! Just finished the RealChat feature set 🚀",
    type: "text",
    isForwarded: false,
    timestamp: new Date(Date.now() - 3_400_000).toISOString(),
    readBy: ["user-1"],
  },
  {
    id: uuidv4(),
    roomId: "room-2",
    senderId: "user-3",
    senderName: "Charlie Brown",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
    content: "Alice, did you see the latest design mockups? They look amazing!",
    type: "text",
    isForwarded: false,
    timestamp: new Date(Date.now() - 7_200_000).toISOString(),
    readBy: ["user-1", "user-3"],
  },
  {
    id: uuidv4(),
    roomId: "room-2",
    senderId: "user-1",
    senderName: "Alice Johnson",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    content: "Yes! The glassmorphism effects are stunning. Great work Charlie!",
    type: "text",
    isForwarded: false,
    timestamp: new Date(Date.now() - 7_100_000).toISOString(),
    readBy: ["user-1", "user-3"],
  },
  {
    id: uuidv4(),
    roomId: "room-5",
    senderId: "user-4",
    senderName: "Diana Prince",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
    content: "Hey team! Sprint planning starts in 30 minutes 📋",
    type: "text",
    isForwarded: false,
    timestamp: new Date(Date.now() - 1_800_000).toISOString(),
    readBy: ["user-1", "user-4"],
  },
  {
    id: uuidv4(),
    roomId: "room-5",
    senderId: "user-2",
    senderName: "Bob Smith",
    senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    content: "On my way! I'll present the WebSocket architecture overview.",
    type: "text",
    isForwarded: false,
    timestamp: new Date(Date.now() - 1_700_000).toISOString(),
    readBy: ["user-2", "user-4"],
  },
];

//  DB API

export const db = {
  // Users
  getUsers: (): DBUser[] => [...users],
  getUserById: (id: string): DBUser | undefined =>
    users.find((u) => u.id === id),
  getUserByEmail: (email: string): DBUser | undefined =>
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()),
  createUser: (data: Omit<DBUser, "id" | "createdAt" | "isOnline">): DBUser => {
    const user: DBUser = {
      ...data,
      id: `user-${uuidv4().slice(0, 8)}`,
      isOnline: false,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    return user;
  },
  setUserOnline: (id: string, online: boolean): void => {
    const user = users.find((u) => u.id === id);
    if (user) user.isOnline = online;
  },

  // Conversations
  getConversations: (): DBConversation[] => [...conversations],
  getConversationsByUser: (userId: string): DBConversation[] =>
    conversations.filter((c) => c.participants.includes(userId)),
  getConversationById: (id: string): DBConversation | undefined =>
    conversations.find((c) => c.id === id),
  createConversation: (
    data: Omit<DBConversation, "id" | "createdAt" | "updatedAt">,
  ): DBConversation => {
    const conv: DBConversation = {
      ...data,
      id: `room-${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    conversations.push(conv);
    return conv;
  },
  updateConversationLastMessage: (roomId: string, message: Message): void => {
    const conv = conversations.find((c) => c.id === roomId);
    if (conv) {
      conv.lastMessage = message;
      conv.updatedAt = new Date().toISOString();
    }
  },

  // Messages
  getMessages: (): Message[] => [...messages],
  getMessagesByRoom: (roomId: string): Message[] =>
    messages
      .filter((m) => m.roomId === roomId)
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
  getMessageById: (id: string): Message | undefined =>
    messages.find((m) => m.id === id),
  addMessage: (message: Message): Message => {
    messages.push(message);
    return message;
  },
  markMessagesRead: (
    roomId: string,
    messageIds: string[],
    userId: string,
  ): void => {
    messages
      .filter((m) => m.roomId === roomId && messageIds.includes(m.id))
      .forEach((m) => {
        if (!m.readBy.includes(userId)) m.readBy.push(userId);
      });
  },
};

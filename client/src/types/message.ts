export type MediaType = 'image' | 'video' | 'raw';

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  mediaType?: MediaType;
  isForwarded: boolean;
  originalSenderId?: string;
  originalSenderName?: string;
  timestamp: string;
  readBy: string[];
}

export interface SendMessagePayload {
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  mediaType?: MediaType;
}

export interface ForwardMessagePayload {
  messageId: string;
  fromRoomId: string;
  toRoomId: string;
  forwardedBy: string;
  forwardedByName: string;
}

export interface TypingPayload {
  roomId: string;
  userId: string;
  userName: string;
}

export interface MarkReadPayload {
  roomId: string;
  userId: string;
  messageIds: string[];
}

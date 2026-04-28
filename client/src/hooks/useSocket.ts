// src/hooks/useSocket.ts
import { useEffect, useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { socketService } from '../services/socketService';
import { addMessage } from '../features/messages/messagesSlice';
import { updateLastMessage, setUserOnline } from '../features/conversations/conversationsSlice';
import { setTypingUser, removeTypingUser, addToast } from '../features/ui/uiSlice';
import type { AppDispatch } from '../app/store';
import type { Message, TypingPayload, ServerToClientEvents, ClientToServerEvents } from '../types';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// Module-level state to survive React StrictMode double-invoke
let activeUserId: string | null = null;
let consumerCount = 0;
let listenersAttached = false;

function detach(socket: AppSocket) {
  socket.off('new_message');
  socket.off('message_forwarded');
  socket.off('user_typing');
  socket.off('user_stopped_typing');
  socket.off('user_online');
  socket.off('user_offline');
  socket.off('error');
}

function attach(socket: AppSocket, dispatch: AppDispatch) {
  detach(socket);

  const syncMessage = (msg: Message) => {
    dispatch(addMessage(msg));
    dispatch(
      updateLastMessage({
        roomId: msg.roomId,
        message: {
          id: msg.id,
          content: msg.content,
          senderId: msg.senderId,
          senderName: msg.senderName,
          timestamp: msg.timestamp,
          type: msg.type,
        },
      }),
    );
  };

  socket.on('new_message', syncMessage);

  socket.on('message_forwarded', (msg: Message) => {
    syncMessage(msg);
    dispatch(
      addToast({
        id: `fwd-${msg.id}`,
        message: `Message forwarded by ${msg.senderName}`,
        type: 'info',
        duration: 3000,
      }),
    );
  });

  socket.on('user_typing', (payload: TypingPayload) => {
    dispatch(setTypingUser({ roomId: payload.roomId, userId: payload.userId, userName: payload.userName }));
  });

  socket.on('user_stopped_typing', (payload: TypingPayload) => {
    dispatch(removeTypingUser({ roomId: payload.roomId, userId: payload.userId }));
  });

  socket.on('user_online', ({ userId }) => dispatch(setUserOnline({ userId, isOnline: true })));
  socket.on('user_offline', ({ userId }) => dispatch(setUserOnline({ userId, isOnline: false })));

  socket.on('error', ({ message }) => {
    dispatch(
      addToast({ id: `err-${Date.now()}`, message, type: 'error', duration: 4000 }),
    );
  });
}

export function useSocket() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Identity changed → tear down old connection
    if (activeUserId !== null && activeUserId !== user.id) {
      const prev = socketService.getSocket();
      if (prev) detach(prev);
      socketService.disconnect();
      activeUserId = null;
      listenersAttached = false;
      consumerCount = 0;
    }

    consumerCount += 1;
    const socket = socketService.connect(user.id, user.username);
    activeUserId = user.id;

    if (!listenersAttached) {
      attach(socket, dispatch);
      listenersAttached = true;
    }

    return () => {
      consumerCount = Math.max(0, consumerCount - 1);
      if (consumerCount === 0) {
        const s = socketService.getSocket();
        if (s) detach(s);
        socketService.disconnect();
        activeUserId = null;
        listenersAttached = false;
      }
    };
  }, [isAuthenticated, user, dispatch]);

  const sendMessage = useCallback(
    (payload: {
      roomId: string;
      content: string;
      type: 'text' | 'image' | 'video';
      mediaUrl?: string;
      mediaType?: 'image' | 'video' | 'raw';
    }) => {
      if (!user) return;
      socketService.getSocket()?.emit('send_message', {
        ...payload,
        senderId: user.id,
        senderName: user.username,
        senderAvatar: user.avatar,
      });
    },
    [user],
  );

  const joinRoom = useCallback((roomId: string) => {
    socketService.getSocket()?.emit('join_room', { roomId });
  }, []);

  const forwardMessage = useCallback(
    (messageId: string, fromRoomId: string, toRoomId: string) => {
      if (!user) return;
      socketService.getSocket()?.emit('forward_message', {
        messageId,
        fromRoomId,
        toRoomId,
        forwardedBy: user.id,
        forwardedByName: user.username,
      });
    },
    [user],
  );

  const startTyping = useCallback(
    (roomId: string) => {
      if (!user) return;
      socketService.getSocket()?.emit('typing_start', {
        roomId,
        userId: user.id,
        userName: user.username,
      });
    },
    [user],
  );

  const stopTyping = useCallback(
    (roomId: string) => {
      if (!user) return;
      socketService.getSocket()?.emit('typing_stop', {
        roomId,
        userId: user.id,
        userName: user.username,
      });
    },
    [user],
  );

  return { sendMessage, joinRoom, forwardMessage, startTyping, stopTyping };
}

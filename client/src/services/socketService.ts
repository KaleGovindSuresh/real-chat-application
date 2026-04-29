// src/services/socketService.ts
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '../types';
import { getSocketUrl } from '../config/runtime';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class SocketService {
  private socket: AppSocket | null = null;

  connect(userId: string, userName: string): AppSocket {
    if (this.socket?.connected) return this.socket;

    const url = getSocketUrl();

    this.socket = io(url, {
      auth: { userId, userName },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1_000,
    }) as AppSocket;

    this.socket.on('connect', () => console.log('[Socket] connected:', this.socket?.id));
    this.socket.on('disconnect', (reason) => console.log('[Socket] disconnected:', reason));
    this.socket.on('connect_error', (err) => console.error('[Socket] error:', err.message));

    return this.socket;
  }

  getSocket(): AppSocket | null {
    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();

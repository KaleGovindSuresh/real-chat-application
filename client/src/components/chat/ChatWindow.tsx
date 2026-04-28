// src/components/chat/ChatWindow.tsx
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../app/hooks';
import { useSocket } from '../../hooks/useSocket';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import DropZone from '../media/DropZone';
import { FiMessageCircle, FiArrowLeft } from 'react-icons/fi';

export default function ChatWindow() {
  const activeId = useAppSelector((state) => state.conversations.activeConversationId);
  const { joinRoom } = useSocket();

  useEffect(() => {
    if (activeId) joinRoom(activeId);
  }, [activeId, joinRoom]);

  if (!activeId) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03,
          backgroundImage: `radial-gradient(circle at 25px 25px, var(--text-primary) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 100, height: 100, borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', border: '1px solid var(--border-secondary)',
            }}
          >
            <FiMessageCircle size={42} color="var(--color-primary)" />
          </motion.div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            <span className="gradient-text">Welcome to RealChat</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 360, lineHeight: 1.6 }}>
            Select a conversation from the sidebar to start messaging in real-time
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginTop: 24, justifyContent: 'center',
            color: 'var(--text-tertiary)', fontSize: 13,
          }}>
            <FiArrowLeft size={14} />
            <span>Choose a chat to begin</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <DropZone>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            height: '100%', background: 'var(--bg-primary)',
          }}
        >
          <ChatHeader />
          <MessageList roomId={activeId} />
          <MessageInput key={activeId} roomId={activeId} />
        </motion.div>
      </AnimatePresence>
    </DropZone>
  );
}

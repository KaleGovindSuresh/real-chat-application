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

interface ChatWindowProps {
  isMobile: boolean;
  onBack: () => void;
}

export default function ChatWindow({ isMobile, onBack }: ChatWindowProps) {
  const activeId = useAppSelector((state) => state.conversations.activeConversationId);
  const { joinRoom } = useSocket();

  useEffect(() => {
    if (activeId) joinRoom(activeId);
  }, [activeId, joinRoom]);

  if (!activeId) {
    return (
      <div
        className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6"
        style={{ backgroundColor: '#0f172a' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-1 text-center"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[20px] border"
            style={{
              borderColor: 'rgba(148, 163, 184, 0.12)',
              backgroundColor: '#132033',
            }}
          >
            <FiMessageCircle size={34} color="var(--color-primary)" />
          </motion.div>
          <h2 className="mb-2 text-3xl font-bold text-(--text-primary)">Welcome to RealChat</h2>
          <p className="mx-auto max-w-md text-sm leading-7 text-(--text-secondary) sm:text-base">
            Select a conversation from the sidebar to start messaging in real-time
          </p>
          <div
            className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs sm:text-sm"
            style={{
              borderColor: 'rgba(148, 163, 184, 0.12)',
              backgroundColor: '#132033',
              color: 'var(--text-tertiary)',
            }}
          >
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
          className="flex h-full flex-1 flex-col bg-transparent"
        >
          <ChatHeader isMobile={isMobile} onBack={onBack} />
          <MessageList roomId={activeId} isMobile={isMobile} />
          <MessageInput key={activeId} roomId={activeId} isMobile={isMobile} />
        </motion.div>
      </AnimatePresence>
    </DropZone>
  );
}

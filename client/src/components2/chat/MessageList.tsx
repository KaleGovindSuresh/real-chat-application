// MessageList — scrollable message feed

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../app/hooks';
import { useScrollToBottom } from '../../hooks/useScrollToBottom';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import Spinner from '../ui/Spinner';
import { formatDateSeparator } from '../../utils/formatTime';
import type { Message } from '../../types';
import { FiMessageCircle } from 'react-icons/fi';

interface Props {
  roomId: string;
  isMobile: boolean;
}

const EMPTY_MESSAGES: Message[] = [];

// Group messages by date
function groupByDate(messages: Message[]): { date: string; messages: Message[] }[] {
  const groups: { date: string; messages: Message[] }[] = [];
  let currentDate = '';

  for (const msg of messages) {
    const msgDate = new Date(msg.timestamp).toDateString();
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groups.push({ date: msg.timestamp, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }
  return groups;
}

export default function MessageList({ roomId, isMobile }: Props) {
  const messages = useAppSelector((state) => state.messages.byRoomId[roomId] ?? EMPTY_MESSAGES);
  const isLoading = useAppSelector((state) => state.messages.isLoading);
  const currentUser = useAppSelector((state) => state.auth.user);
  const { ref, scrollToBottom } = useScrollToBottom<HTMLDivElement>([messages.length]);

  useEffect(() => {
    scrollToBottom(false);
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  const groups = groupByDate(messages);

  return (
    <div
      ref={ref}
      className={isMobile ? 'flex flex-1 flex-col overflow-y-auto px-3 py-4' : 'flex flex-1 flex-col overflow-y-auto px-6 py-5'}
      style={{ backgroundColor: '#0f172a' }}
    >
      {messages.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-[var(--text-tertiary)]">
          <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--bg-hover)]">
            <FiMessageCircle size={30} color="var(--text-secondary)" />
          </div>
          <p className="text-[15px] font-medium">No messages yet</p>
          <p className="text-[13px]">Send a message to start the conversation</p>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {groups.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div className="my-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-[var(--border-primary)]" />
              <span
                className="whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold text-[var(--text-tertiary)]"
                style={{ backgroundColor: '#132033' }}
              >
                {formatDateSeparator(group.date)}
              </span>
              <div className="h-px flex-1 bg-[var(--border-primary)]" />
            </div>

            {group.messages.map((msg, i) => {
              const prev = i > 0 ? group.messages[i - 1] : null;
              const showAvatar = !prev || prev.senderId !== msg.senderId;
              return (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  isOwn={msg.senderId === currentUser?.id}
                  showAvatar={showAvatar}
                  isMobile={isMobile}
                />
              );
            })}
          </div>
        ))}
      </AnimatePresence>

      <TypingIndicator roomId={roomId} />
    </div>
  );
}

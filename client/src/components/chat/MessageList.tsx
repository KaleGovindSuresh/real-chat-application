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

interface Props {
  roomId: string;
}

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

export default function MessageList({ roomId }: Props) {
  const messages = useAppSelector((state) => state.messages.byRoomId[roomId] || []);
  const isLoading = useAppSelector((state) => state.messages.isLoading);
  const currentUser = useAppSelector((state) => state.auth.user);
  const { ref, scrollToBottom } = useScrollToBottom<HTMLDivElement>([messages.length]);

  useEffect(() => {
    scrollToBottom(false);
  }, [roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Spinner size={32} />
      </div>
    );
  }

  const groups = groupByDate(messages);

  return (
      <div
      ref={ref}
      className="message-list"
      style={{
        flex: 1, overflowY: 'auto', padding: '20px 24px',
        display: 'flex', flexDirection: 'column',
        minHeight: 0,
      }}
    >
      {messages.length === 0 && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-tertiary)', gap: 12,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 'var(--radius-full)',
            background: 'var(--bg-hover)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>
            💬
          </div>
          <p style={{ fontSize: 15, fontWeight: 500 }}>No messages yet</p>
          <p style={{ fontSize: 13 }}>Send a message to start the conversation</p>
        </div>
      )}

      <AnimatePresence mode="popLayout">
        {groups.map((group) => (
          <div key={group.date}>
            {/* Date separator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 16,
              margin: '16px 0',
            }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border-primary)' }} />
              <span style={{
                fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)',
                background: 'var(--bg-tertiary)', padding: '4px 12px',
                borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
              }}>
                {formatDateSeparator(group.date)}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border-primary)' }} />
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

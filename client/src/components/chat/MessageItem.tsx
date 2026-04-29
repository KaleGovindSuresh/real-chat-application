// MessageItem — single message bubble

import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { formatMessageTime } from '../../utils/formatTime';
import Avatar from '../ui/Avatar';
import { FiCornerUpRight } from 'react-icons/fi';
import type { Message } from '../../types';
import { useIsMobile } from '../../hooks/useIsMobile';

interface Props {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

export default function MessageItem({ message, isOwn, showAvatar }: Props) {
  const isMobile = useIsMobile();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `msg-${message.id}`,
    data: { type: 'message', message },
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    display: 'flex',
    flexDirection: isOwn ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: showAvatar ? 12 : 4,
    paddingLeft: isOwn ? (isMobile ? 24 : 60) : 0,
    paddingRight: isOwn ? 0 : (isMobile ? 24 : 60),
  };

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      initial={{ opacity: 0, x: isOwn ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Avatar */}
      <div style={{ width: 32, flexShrink: 0 }}>
        {showAvatar && !isOwn && (
          <Avatar src={message.senderAvatar} name={message.senderName} size={32} />
        )}
      </div>

      {/* Bubble */}
      <div style={{
        maxWidth: isMobile ? '84%' : '70%',
        position: 'relative',
      }}>
        {/* Forwarded badge */}
        {message.isForwarded && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, color: 'var(--text-tertiary)',
            marginBottom: 4, fontStyle: 'italic',
          }}>
            <FiCornerUpRight size={11} />
            Forwarded{message.originalSenderName ? ` from ${message.originalSenderName}` : ''}
          </div>
        )}

        {/* Sender name */}
        {showAvatar && !isOwn && (
          <div style={{
            fontSize: 12, fontWeight: 600, color: 'var(--color-primary-light)',
            marginBottom: 4,
          }}>
            {message.senderName}
          </div>
        )}

        <div style={{
          padding: message.type === 'text' ? '10px 14px' : '6px',
          background: isOwn
            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
            : 'var(--bg-message-other)',
          borderRadius: isOwn
            ? '16px 16px 4px 16px'
            : '16px 16px 16px 4px',
          boxShadow: 'var(--shadow-message)',
          border: isOwn ? 'none' : '1px solid var(--border-primary)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Content */}
          {message.type === 'text' && (
            <p style={{
              fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word',
              color: isOwn ? '#ffffff' : 'var(--text-primary)',
              margin: 0,
            }}>
              {message.content}
            </p>
          )}

          {message.type === 'image' && message.mediaUrl && (
            <img
              src={message.mediaUrl}
              alt="Shared image"
              style={{
                maxWidth: '100%',
                maxHeight: isMobile ? 220 : 300,
                borderRadius: isOwn ? '12px 12px 0 12px' : '12px 12px 12px 0',
                display: 'block',
              }}
            />
          )}

          {message.type === 'video' && message.mediaUrl && (
            <video
              src={message.mediaUrl}
              controls
              style={{
                maxWidth: '100%',
                maxHeight: isMobile ? 220 : 300,
                borderRadius: isOwn ? '12px 12px 0 12px' : '12px 12px 12px 0',
                display: 'block',
              }}
            />
          )}

          {/* Caption for media */}
          {message.type !== 'text' && message.content && (
            <p style={{
              fontSize: 13, padding: '8px 8px 4px',
              color: isOwn ? '#ffffff' : 'var(--text-primary)',
              margin: 0,
            }}>
              {message.content}
            </p>
          )}

          {/* Timestamp */}
          <div style={{
            fontSize: 10, marginTop: 4,
            textAlign: 'right',
            color: isOwn ? 'rgba(255,255,255,0.6)' : 'var(--text-tertiary)',
            padding: message.type !== 'text' ? '0 8px 4px' : 0,
          }}>
            {formatMessageTime(message.timestamp)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ChatHeader — room/user info + actions

import { motion } from 'framer-motion';
import { useAppSelector } from '../../app/hooks';
import Avatar from '../ui/Avatar';
import { FiPhone, FiVideo, FiMoreVertical } from 'react-icons/fi';

export default function ChatHeader() {
  const activeId = useAppSelector((state) => state.conversations.activeConversationId);
  const conversations = useAppSelector((state) => state.conversations.list);
  const user = useAppSelector((state) => state.auth.user);
  const typingUsers = useAppSelector((state) => state.ui.typingUsers);

  const activeConv = conversations.find((c) => c.id === activeId);
  if (!activeConv) return null;

  const otherParticipants = activeConv.participantUsers?.filter((p) => p.id !== user?.id) || [];
  const displayName = otherParticipants.length === 1
    ? otherParticipants[0].username
    : activeConv.name;
  const avatar = otherParticipants.length === 1 ? otherParticipants[0].avatar : undefined;
  const isOnline = otherParticipants.length === 1 ? otherParticipants[0].isOnline : false;

  const roomTyping = typingUsers[activeId || ''] || [];
  const typingNames = roomTyping
    .filter((t) => t.userId !== user?.id)
    .map((t) => t.userName);

  const actionBtnStyle: React.CSSProperties = {
    background: 'var(--bg-hover)', border: 'none', borderRadius: 'var(--radius-md)',
    width: 36, height: 36, cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
    transition: 'all var(--transition-fast)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: '14px 24px',
        borderBottom: '1px solid var(--border-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Avatar src={avatar} name={displayName} size={42} isOnline={isOnline} />
        <div>
          <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>{displayName}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
            {typingNames.length > 0 ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: 'var(--color-primary)' }}
              >
                {typingNames.join(', ')} {typingNames.length === 1 ? 'is' : 'are'} typing...
              </motion.span>
            ) : (
              isOnline ? 'Online' : 'Offline'
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={actionBtnStyle}>
          <FiPhone size={16} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={actionBtnStyle}>
          <FiVideo size={16} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={actionBtnStyle}>
          <FiMoreVertical size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

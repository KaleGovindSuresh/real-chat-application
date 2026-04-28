// ChatHeader — room/user info + actions

import { motion } from 'framer-motion';
import { useAppSelector } from '../../app/hooks';
import Avatar from '../ui/Avatar';
import { FiPhone, FiVideo, FiMoreVertical, FiArrowLeft } from 'react-icons/fi';
import { cn } from '../../utils/cn';

interface ChatHeaderProps {
  isMobile: boolean;
  onBack: () => void;
}

export default function ChatHeader({ isMobile, onBack }: ChatHeaderProps) {
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

  const actionBtnClass =
    'flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-(--text-secondary) transition hover:text-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center justify-between gap-3 border-b',
        isMobile ? 'px-3 py-3' : 'px-6 py-4',
      )}
      style={{
        borderColor: 'rgba(148, 163, 184, 0.12)',
        backgroundColor: '#0f172a',
      }}
    >
      <div className={cn('flex min-w-0 items-center', isMobile ? 'gap-3' : 'gap-4')}>
        {isMobile && (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onBack}
            className={actionBtnClass}
            style={{ borderColor: 'rgba(148, 163, 184, 0.12)', backgroundColor: '#132033' }}
          >
            <FiArrowLeft size={16} />
          </motion.button>
        )}
        <Avatar src={avatar} name={displayName} size={42} isOnline={isOnline} />
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold text-(--text-primary)">{displayName}</div>
          <div className="text-xs text-[var(--text-tertiary)]">
            {typingNames.length > 0 ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[var(--color-primary)]"
              >
                {typingNames.join(', ')} {typingNames.length === 1 ? 'is' : 'are'} typing...
              </motion.span>
            ) : (
              isOnline ? 'Online' : 'Offline'
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className={actionBtnClass}
          style={{ borderColor: 'rgba(148, 163, 184, 0.12)', backgroundColor: '#132033' }}
        >
          <FiPhone size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className={actionBtnClass}
          style={{ borderColor: 'rgba(148, 163, 184, 0.12)', backgroundColor: '#132033' }}
        >
          <FiVideo size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className={actionBtnClass}
          style={{ borderColor: 'rgba(148, 163, 184, 0.12)', backgroundColor: '#132033' }}
        >
          <FiMoreVertical size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}

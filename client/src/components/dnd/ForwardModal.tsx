// ForwardModal — confirm forward + pick recipient

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeForwardModal } from '../../features/ui/uiSlice';
import { addToast } from '../../features/ui/uiSlice';
import { useSocket } from '../../hooks/useSocket';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import { FiCornerUpRight, FiCheck } from 'react-icons/fi';

export default function ForwardModal() {
  const dispatch = useAppDispatch();
  const { forwardMessage } = useSocket();
  const isOpen = useAppSelector((state) => state.ui.isForwardModalOpen);
  const messageId = useAppSelector((state) => state.ui.forwardingMessageId);
  const preSelectedRoomId = useAppSelector((state) => state.ui.forwardTargetRoomId);
  const conversations = useAppSelector((state) => state.conversations.list);
  const activeRoomId = useAppSelector((state) => state.conversations.activeConversationId);
  const currentUser = useAppSelector((state) => state.auth.user);

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(preSelectedRoomId);

  // Reset selection when modal opens
  const effectiveSelection = selectedRoomId || preSelectedRoomId;

  const handleForward = () => {
    if (!messageId || !effectiveSelection || !activeRoomId) return;

    forwardMessage(messageId, activeRoomId, effectiveSelection);

    dispatch(closeForwardModal());
    dispatch(
      addToast({
        id: `fwd-confirm-${Date.now()}`,
        message: 'Message forwarded successfully!',
        type: 'success',
        duration: 3000,
      })
    );
    setSelectedRoomId(null);
  };

  const handleClose = () => {
    dispatch(closeForwardModal());
    setSelectedRoomId(null);
  };

  const availableConversations = conversations.filter((c) => c.id !== activeRoomId);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Forward Message">
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
        Select a conversation to forward this message to:
      </p>

      <div style={{
        maxHeight: 300, overflowY: 'auto',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        {availableConversations.map((conv) => {
          const otherParticipants = conv.participantUsers?.filter(
            (p) => p.id !== currentUser?.id
          ) || [];
          const displayName = otherParticipants.length === 1
            ? otherParticipants[0].username
            : conv.name;
          const avatar = otherParticipants.length === 1
            ? otherParticipants[0].avatar
            : undefined;
          const isSelected = effectiveSelection === conv.id;

          return (
            <motion.div
              key={conv.id}
              whileHover={{ backgroundColor: 'var(--bg-hover)' }}
              onClick={() => setSelectedRoomId(conv.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                background: isSelected ? 'var(--color-primary-alpha)' : 'transparent',
                border: isSelected ? '1px solid var(--color-primary)' : '1px solid transparent',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Avatar src={avatar} name={displayName} size={36} />
              <span style={{
                flex: 1, fontSize: 14, fontWeight: 500,
                color: 'var(--text-primary)',
              }}>
                {displayName}
              </span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <FiCheck size={14} color="#fff" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div style={{
        display: 'flex', gap: 10, marginTop: 20,
        justifyContent: 'flex-end',
      }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClose}
          style={{
            padding: '10px 20px', background: 'var(--bg-hover)',
            border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500,
            fontSize: 14, fontFamily: 'var(--font-family)',
          }}
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleForward}
          disabled={!effectiveSelection}
          style={{
            padding: '10px 20px',
            background: effectiveSelection
              ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
              : 'var(--bg-hover)',
            border: 'none', borderRadius: 'var(--radius-md)',
            color: effectiveSelection ? '#fff' : 'var(--text-tertiary)',
            cursor: effectiveSelection ? 'pointer' : 'default',
            fontWeight: 600, fontSize: 14, fontFamily: 'var(--font-family)',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: effectiveSelection ? '0 4px 12px rgba(99,102,241,0.4)' : 'none',
          }}
        >
          <FiCornerUpRight size={15} />
          Forward
        </motion.button>
      </div>
    </Modal>
  );
}

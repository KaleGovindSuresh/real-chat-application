// Sidebar — Conversation list panel

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setConversations, setActiveConversation } from '../../features/conversations/conversationsSlice';
import { setMessages, setLoading } from '../../features/messages/messagesSlice';
import apiClient from '../../services/apiClient';
import Avatar from '../ui/Avatar';
import { formatTime } from '../../utils/formatTime';
import { FiSearch, FiLogOut, FiMessageCircle, FiEdit } from 'react-icons/fi';
import { logout } from '../../features/auth/authSlice';
import type { Conversation } from '../../types';
import { useDroppable } from '@dnd-kit/core';

function ConversationDropTarget({ conv, isActive, onClick, currentUserId }: {
  conv: Conversation; isActive: boolean; onClick: () => void; currentUserId: string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-conv-${conv.id}`,
    data: { type: 'conversation', roomId: conv.id, recipientName: conv.name },
  });

  const otherParticipants = conv.participantUsers?.filter((p) => p.id !== currentUserId) || [];
  const displayName = otherParticipants.length === 1
    ? otherParticipants[0].username
    : conv.name;
  const avatar = otherParticipants.length === 1 ? otherParticipants[0].avatar : undefined;
  const isOnline = otherParticipants.length === 1 ? otherParticipants[0].isOnline : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'var(--bg-hover)' }}
      className={isOver ? 'drop-target-active' : ''}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px', cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        background: isActive ? 'var(--bg-hover)' : isOver ? 'rgba(99,102,241,0.1)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
        transition: 'all var(--transition-fast)',
        position: 'relative',
      }}
    >
      <Avatar src={avatar} name={displayName} size={44} isOnline={isOnline} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 2,
        }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {displayName}
          </span>
          {conv.lastMessage && (
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', flexShrink: 0, marginLeft: 8 }}>
              {formatTime(conv.lastMessage.timestamp)}
            </span>
          )}
        </div>
        {conv.lastMessage && (
          <p style={{
            fontSize: 13, color: 'var(--text-tertiary)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: '100%',
          }}>
            {conv.lastMessage.type !== 'text'
              ? `📎 ${conv.lastMessage.type === 'image' ? 'Image' : 'Video'}`
              : conv.lastMessage.content}
          </p>
        )}
      </div>
      {isOver && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'var(--color-primary)', borderRadius: 'var(--radius-full)',
            width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <FiEdit size={12} color="#fff" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const conversations = useAppSelector((state) => state.conversations.list);
  const activeId = useAppSelector((state) => state.conversations.activeConversationId);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;
    const loadConversations = async () => {
      try {
        const res = await apiClient.get(`/api/conversations?userId=${user.id}`);
        dispatch(setConversations(res.data));
      } catch (err) {
        console.error('Failed to load conversations:', err);
      }
    };
    loadConversations();
  }, [user, dispatch]);

  const handleSelectConversation = async (conv: Conversation) => {
    dispatch(setActiveConversation(conv.id));
    dispatch(setLoading(true));
    try {
      const res = await apiClient.get(`/api/messages/${conv.id}`);
      dispatch(setMessages({ roomId: conv.id, messages: res.data }));
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  };

  const filtered = conversations.filter((c) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(searchLower) ||
      c.participantUsers?.some((p) => p.username.toLowerCase().includes(searchLower))
    );
  });

  // Sort by last message time
  const sorted = [...filtered].sort((a, b) => {
    const ta = a.lastMessage?.timestamp || a.updatedAt;
    const tb = b.lastMessage?.timestamp || b.updatedAt;
    return new Date(tb).getTime() - new Date(ta).getTime();
  });

  return (
    <div style={{
      width: 340, height: '100%', display: 'flex', flexDirection: 'column',
      background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-primary)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 20px 16px', borderBottom: '1px solid var(--border-primary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <FiMessageCircle size={18} color="#fff" />
            </div>
            <span style={{ fontSize: 20, fontWeight: 700 }} className="gradient-text">RealChat</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(logout())}
            style={{
              background: 'var(--bg-hover)', border: 'none', borderRadius: 'var(--radius-md)',
              width: 36, height: 36, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)',
            }}
            title="Logout"
          >
            <FiLogOut size={16} />
          </motion.button>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-input)', borderRadius: 'var(--radius-md)',
          padding: '0 12px', border: '1px solid var(--border-primary)',
        }}>
          <FiSearch size={15} color="var(--text-tertiary)" />
          <input
            id="conversation-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              padding: '10px 0', color: 'var(--text-primary)', fontSize: 13,
              fontFamily: 'var(--font-family)',
            }}
          />
        </div>
      </div>

      {/* User info bar */}
      {user && (
        <div style={{
          padding: '12px 20px', borderBottom: '1px solid var(--border-primary)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Avatar src={user.avatar} name={user.username} size={32} isOnline={true} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.username}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{user.email}</div>
          </div>
        </div>
      )}

      {/* Conversation list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
        <AnimatePresence>
          {sorted.map((conv) => (
            <ConversationDropTarget
              key={conv.id}
              conv={conv}
              isActive={conv.id === activeId}
              onClick={() => handleSelectConversation(conv)}
              currentUserId={user?.id || ''}
            />
          ))}
        </AnimatePresence>

        {sorted.length === 0 && (
          <div style={{
            textAlign: 'center', padding: 40, color: 'var(--text-tertiary)', fontSize: 14,
          }}>
            {search ? 'No conversations found' : 'No conversations yet'}
          </div>
        )}
      </div>
    </div>
  );
}

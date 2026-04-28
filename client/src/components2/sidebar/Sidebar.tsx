// Sidebar — Conversation list panel

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { setConversations, setActiveConversation } from '../../features/conversations/conversationsSlice';
import { setMessages, setLoading } from '../../features/messages/messagesSlice';
import apiClient from '../../services/apiClient';
import Avatar from '../ui/Avatar';
import { formatTime } from '../../utils/formatTime';
import { FiSearch, FiLogOut, FiMessageCircle, FiEdit, FiImage, FiVideo } from 'react-icons/fi';
import { logout } from '../../features/auth/authSlice';
import type { Conversation } from '../../types';
import { useDroppable } from '@dnd-kit/core';
import { cn } from '../../utils/cn';

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
      whileHover={{ y: -1 }}
      className={cn(
        'group relative flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition duration-150',
        isActive
          ? 'border-[color:rgba(99,102,241,0.34)] bg-[rgba(99,102,241,0.12)]'
          : 'border-transparent hover:border-white/6',
        isOver && 'drop-target-active border-[color:rgba(99,102,241,0.35)] bg-[rgba(99,102,241,0.12)]',
      )}
      style={{
        backgroundColor: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
      }}
    >
      <Avatar src={avatar} name={displayName} size={44} isOnline={isOnline} />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-(--text-primary)">
            {displayName}
          </span>
          {conv.lastMessage && (
            <span className="shrink-0 text-[11px] text-[var(--text-tertiary)]">
              {formatTime(conv.lastMessage.timestamp)}
            </span>
          )}
        </div>
        {conv.lastMessage && (
          <p className="flex max-w-full items-center gap-1.5 truncate text-[13px] text-[var(--text-tertiary)]">
            {conv.lastMessage.type !== 'text'
              ? (
                <>
                  {conv.lastMessage.type === 'image' ? <FiImage size={13} /> : <FiVideo size={13} />}
                  {conv.lastMessage.type === 'image' ? 'Image' : 'Video'}
                </>
              )
              : conv.lastMessage.content}
          </p>
        )}
      </div>
      {isOver && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-primary)]"
        >
          <FiEdit size={12} color="#fff" />
        </motion.div>
      )}
    </motion.div>
  );
}

interface SidebarProps {
  isMobile: boolean;
  isOpen: boolean;
  onConversationSelect: () => void;
}

export default function Sidebar({ isMobile, isOpen, onConversationSelect }: SidebarProps) {
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
    onConversationSelect();
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
    <aside
      className={cn(
        'h-full max-w-full flex-col border-r md:rounded-[18px] md:border',
        isOpen ? 'flex' : 'hidden',
        isMobile ? 'w-full' : 'w-[348px]',
      )}
      style={{
        borderColor: 'rgba(148, 163, 184, 0.12)',
        backgroundColor: '#0f172a',
        boxShadow: isMobile ? undefined : '0 18px 40px rgba(2, 6, 23, 0.24)',
      }}
    >
      <div
        className={cn('border-b', isMobile ? 'px-4 pb-3 pt-4' : 'px-5 pb-4 pt-5')}
        style={{ borderColor: 'rgba(148, 163, 184, 0.12)' }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <FiMessageCircle size={18} color="#fff" />
            </div>
            <div>
              <div className="text-[1.45rem] font-bold leading-none text-(--text-primary)">RealChat</div>
              <div className="mt-1 text-xs text-[var(--text-tertiary)]">Realtime workspace</div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(logout())}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border text-(--text-secondary) transition hover:text-white"
            style={{ borderColor: 'rgba(148, 163, 184, 0.12)', backgroundColor: '#132033' }}
            title="Logout"
          >
            <FiLogOut size={16} />
          </motion.button>
        </div>

        <div
          className="flex items-center gap-2 rounded-lg border px-3.5"
          style={{
            borderColor: 'rgba(148, 163, 184, 0.12)',
            backgroundColor: '#132033',
          }}
        >
          <FiSearch size={18} color="var(--text-tertiary)" />
          <input
            id="conversation-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-transparent py-3 text-sm text-(--text-primary) outline-none placeholder:text-[var(--text-tertiary)]"
          />
        </div>
      </div>

      {/* User info bar */}
      {user && (
        <div
          className={cn('flex items-center gap-3 border-b', isMobile ? 'px-4 py-3' : 'px-5 py-4')}
          style={{
            borderColor: 'rgba(148, 163, 184, 0.12)',
            backgroundColor: '#111c2e',
          }}
        >
          <Avatar src={user.avatar} name={user.username} size={36} isOnline={true} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-(--text-primary)">{user.username}</div>
            <div className="truncate text-xs text-[var(--text-tertiary)]">{user.email}</div>
          </div>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            Online
          </div>
        </div>
      )}

      {/* Conversation list */}
      <div className={cn('flex-1 overflow-y-auto', isMobile ? 'px-2 py-2' : 'px-3 py-3')}>
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
          <div className="px-6 py-12 text-center text-sm text-[var(--text-tertiary)]">
            {search ? 'No conversations found' : 'No conversations yet'}
          </div>
        )}
      </div>
    </aside>
  );
}

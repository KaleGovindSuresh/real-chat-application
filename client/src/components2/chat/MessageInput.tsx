// src/components/chat/MessageInput.tsx
import { useState, useRef, useCallback, useEffect } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDraft } from '../../hooks/useDraft';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { useSocket } from '../../hooks/useSocket';
import { ACCEPTED_MEDIA_TYPES, MAX_FILE_SIZE, TYPING_TIMEOUT_MS } from '../../utils/constants';
import { FiSend, FiPaperclip, FiX, FiSmile } from 'react-icons/fi';
import Spinner from '../ui/Spinner';
import { cn } from '../../utils/cn';

interface Props {
  roomId: string;
  isMobile: boolean;
}

export default function MessageInput({ roomId, isMobile }: Props) {
  const { draft, updateDraft, removeDraft } = useDraft(roomId);
  const { upload, clear, isUploading, progress, result, previewUrl, previewType } =
    useMediaUpload();
  const { sendMessage, startTyping, stopTyping } = useSocket();

  const [text, setText] = useState(draft);
  const [sendQueued, setSendQueued] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  // Cleanup typing state on unmount / room change
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (isTypingRef.current) {
        isTypingRef.current = false;
        stopTyping(roomId);
      }
    };
  }, [roomId, stopTyping]);

  const handleTextChange = useCallback(
    (value: string) => {
      setText(value);
      updateDraft(value);

      if (!isTypingRef.current) {
        isTypingRef.current = true;
        startTyping(roomId);
      }
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        stopTyping(roomId);
      }, TYPING_TIMEOUT_MS);
    },
    [updateDraft, startTyping, stopTyping, roomId],
  );

  const stopTypingImmediate = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      stopTyping(roomId);
    }
  }, [roomId, stopTyping]);

  const handleSend = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();

      if (isUploading) {
        setSendQueued(true);
        return;
      }

      if (result) {
        const mediaType = result.resource_type === 'video' ? 'video' : 'image';
        sendMessage({
          roomId,
          content: text.trim(),
          type: mediaType,
          mediaUrl: result.secure_url,
          mediaType: result.resource_type,
        });
        clear();
        setText('');
        setSendQueued(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        removeDraft();
        stopTypingImmediate();
        return;
      }

      if (!text.trim()) return;
      sendMessage({ roomId, content: text.trim(), type: 'text' });
      setText('');
      setSendQueued(false);
      removeDraft();
      stopTypingImmediate();
    },
    [text, result, isUploading, sendMessage, roomId, clear, removeDraft, stopTypingImmediate],
  );

  useEffect(() => {
    if (sendQueued && !isUploading && result) {
      handleSend();
    }
  }, [sendQueued, isUploading, result, handleSend]);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        alert('File size exceeds 10MB limit');
        return;
      }
      if (!ACCEPTED_MEDIA_TYPES.includes(file.type)) {
        alert('Unsupported media type');
        return;
      }
      setSendQueued(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await upload(file);
    },
    [upload],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const hasContent = Boolean(text.trim() || previewUrl || result);
  const canSend = hasContent;

  return (
    <div
      className="border-t"
      style={{
        borderColor: 'rgba(148, 163, 184, 0.12)',
        backgroundColor: '#0f172a',
      }}
    >
      <AnimatePresence>
        {(previewUrl || isUploading) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={cn(
              'border-b',
              isMobile ? 'px-4 py-3' : 'px-5 py-3',
            )}
            style={{ borderColor: 'rgba(148, 163, 184, 0.12)' }}
          >
            <div className="flex items-center gap-3">
              {previewUrl && (
                <div className="relative">
                  {previewType === 'image' ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className={cn(
                        'rounded-xl object-cover',
                        isMobile ? 'h-20 max-w-[120px]' : 'h-20 max-w-[160px]',
                      )}
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      className={cn(
                        'rounded-xl',
                        isMobile ? 'h-20 max-w-[120px]' : 'h-20 max-w-[160px]',
                      )}
                    />
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSendQueued(false);
                      clear();
                    }}
                    className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[var(--color-error)] text-white"
                  >
                    <FiX size={12} />
                  </motion.button>
                </div>
              )}
              {isUploading && (
                <div className="flex-1">
                  <div className="mb-2 text-xs font-medium text-(--text-secondary)">
                    Uploading... {progress}%
                  </div>
                  <div
                    className="h-1.5 overflow-hidden rounded-full"
                    style={{ backgroundColor: '#132033' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full rounded-full bg-[var(--color-primary)]"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form
        onSubmit={handleSend}
        className={cn(
          'flex items-end gap-2.5',
          isMobile ? 'px-3 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3' : 'px-5 py-4',
        )}
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          title="Attach image or video"
          disabled={isUploading}
          className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border text-(--text-secondary) transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          style={{ borderColor: 'rgba(148, 163, 184, 0.12)', backgroundColor: '#132033' }}
        >
          <FiPaperclip size={20} />
        </motion.button>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_MEDIA_TYPES.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div
          className="flex min-w-0 flex-1 items-end rounded-[16px] border px-4"
          style={{ borderColor: 'rgba(148, 163, 184, 0.12)', backgroundColor: '#132033' }}
        >
          <textarea
            id="message-input"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="max-h-[120px] w-full resize-none bg-transparent py-3.5 text-sm leading-6 text-(--text-primary) outline-none placeholder:text-[var(--text-tertiary)]"
          />
          <button
            type="button"
            className="mb-2 ml-2 shrink-0 cursor-pointer border-0 bg-transparent p-1 text-[var(--text-tertiary)] transition hover:text-white"
          >
            <FiSmile size={18} />
          </button>
        </div>

        {/* Send */}
        <motion.button
          id="send-button"
          type="submit"
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          disabled={!canSend}
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition',
            canSend
              ? 'border-transparent bg-[var(--color-primary)] text-white'
              : 'text-[var(--text-tertiary)]',
          )}
          style={!canSend ? { borderColor: 'rgba(148, 163, 184, 0.12)', backgroundColor: '#132033' } : undefined}
        >
          {isUploading ? <Spinner size={16} className="border-white/20 border-t-white" /> : <FiSend size={18} />}
        </motion.button>
      </form>
    </div>
  );
}

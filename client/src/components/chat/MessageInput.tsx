// src/components/chat/MessageInput.tsx
import { useState, useRef, useCallback, useEffect } from "react";
import type { FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDraft } from "../../hooks/useDraft";
import { useMediaUpload } from "../../hooks/useMediaUpload";
import { useSocket } from "../../hooks/useSocket";
import { useIsMobile } from "../../hooks/useIsMobile";
import {
  ACCEPTED_MEDIA_TYPES,
  MAX_FILE_SIZE,
  TYPING_TIMEOUT_MS,
} from "../../utils/constants";
import { FiSend, FiPaperclip, FiX, FiSmile } from "react-icons/fi";
import { showErrorToast } from "../../utils/toast";

interface Props {
  roomId: string;
}

export default function MessageInput({ roomId }: Props) {
  const { draft, updateDraft, removeDraft } = useDraft(roomId);
  const {
    upload,
    clear,
    isUploading,
    progress,
    result,
    previewUrl,
    previewType,
  } = useMediaUpload();
  const { sendMessage, startTyping, stopTyping } = useSocket();
  const isMobile = useIsMobile();

  const [text, setText] = useState(draft);
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

      if (result) {
        const mediaType = result.resource_type === "video" ? "video" : "image";
        sendMessage({
          roomId,
          content: text.trim(),
          type: mediaType,
          mediaUrl: result.secure_url,
          mediaType: result.resource_type,
        });
        clear();
        setText("");
        removeDraft();
        stopTypingImmediate();
        return;
      }

      if (!text.trim()) return;
      sendMessage({ roomId, content: text.trim(), type: "text" });
      setText("");
      removeDraft();
      stopTypingImmediate();
    },
    [
      text,
      result,
      sendMessage,
      roomId,
      clear,
      removeDraft,
      stopTypingImmediate,
    ],
  );

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files?.length) return;
      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        showErrorToast("File size exceeds 10MB limit");
        return;
      }
      if (!ACCEPTED_MEDIA_TYPES.includes(file.type)) {
        showErrorToast("Unsupported media type");
        return;
      }
      await upload(file);
    },
    [upload],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const canSend = Boolean(text.trim() || result);

  return (
    <div
      className="message-input-shell"
      style={{
        borderTop: "1px solid var(--border-primary)",
        background: "var(--bg-secondary)",
      }}
    >
      {/* Media preview */}
      <AnimatePresence>
        {(previewUrl || isUploading) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              padding: isMobile ? "10px 14px" : "12px 20px",
              borderBottom: "1px solid var(--border-primary)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {previewUrl && (
                <div style={{ position: "relative" }}>
                  {previewType === "image" ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        height: 80,
                        borderRadius: "var(--radius-md)",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <video
                      src={previewUrl}
                      style={{ height: 80, borderRadius: "var(--radius-md)" }}
                    />
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clear}
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      background: "var(--color-error)",
                      border: "none",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#fff",
                    }}
                  >
                    <FiX size={12} />
                  </motion.button>
                </div>
              )}
              {isUploading && (
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      marginBottom: 6,
                    }}
                  >
                    Uploading... {progress}%
                  </div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: "var(--bg-hover)",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      style={{
                        height: "100%",
                        background:
                          "linear-gradient(90deg, var(--color-primary), var(--color-accent))",
                        borderRadius: 2,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input row */}
      <form
        onSubmit={handleSend}
        className="message-input-form"
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          padding: isMobile
            ? "12px 12px calc(12px + env(safe-area-inset-bottom))"
            : "14px 20px",
        }}
      >
        {/* Single attach button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => fileInputRef.current?.click()}
          title="Attach image or video"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            padding: 6,
            borderRadius: "var(--radius-md)",
            flexShrink: 0,
          }}
        >
          <FiPaperclip size={20} />
        </motion.button>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_MEDIA_TYPES.join(",")}
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: "none" }}
        />

        {/* Text area */}
        <div
          style={{
            flex: 1,
            background: "var(--bg-input)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border-primary)",
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            minWidth: 0,
          }}
        >
          <textarea
            id="message-input"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              padding: "12px 0",
              color: "var(--text-primary)",
              fontSize: 14,
              fontFamily: "var(--font-family)",
              resize: "none",
              maxHeight: isMobile ? 96 : 120,
              lineHeight: 1.5,
            }}
          />
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-tertiary)",
              padding: 4,
            }}
          >
            <FiSmile size={18} />
          </button>
        </div>

        {/* Send */}
        <motion.button
          id="send-button"
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!canSend}
          style={{
            width: 42,
            height: 42,
            borderRadius: "var(--radius-full)",
            background: canSend
              ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
              : "var(--bg-hover)",
            border: "none",
            cursor: canSend ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: canSend ? "#fff" : "var(--text-tertiary)",
            transition: "all var(--transition-fast)",
            flexShrink: 0,
            boxShadow: canSend ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
          }}
        >
          <FiSend size={18} />
        </motion.button>
      </form>
    </div>
  );
}

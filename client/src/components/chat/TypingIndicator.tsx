// TypingIndicator — animated typing dots

import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "../../app/hooks";
import Avatar from "../ui/Avatar";
import { useIsMobile } from "../../hooks/useIsMobile";

interface Props {
  roomId: string;
}

export default function TypingIndicator({ roomId }: Props) {
  const isMobile = useIsMobile();
  const typingUsers = useAppSelector(
    (state) => state.ui.typingUsers[roomId] || [],
  );
  const currentUser = useAppSelector((state) => state.auth.user);

  const othersTyping = typingUsers.filter((t) => t.userId !== currentUser?.id);

  return (
    <AnimatePresence>
      {othersTyping.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: 10, height: 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: isMobile ? "4px 4px 8px" : "4px 16px 8px",
          }}
        >
          <Avatar name={othersTyping[0].userName} size={24} />
          <div
            style={{
              background: "var(--bg-message-other)",
              borderRadius: "16px 16px 16px 4px",
              border: "1px solid var(--border-primary)",
              padding: "8px 14px",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <div className="typing-dots">
              <span />
              <span />
              <span />
            </div>
          </div>
          <span
            style={{
              fontSize: 11,
              color: "var(--text-tertiary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {othersTyping.map((t) => t.userName).join(", ")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

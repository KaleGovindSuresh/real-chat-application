// DragOverlay — ghost preview during drag

import { DragOverlay as DNDDragOverlay } from "@dnd-kit/core";
import type { Active } from "@dnd-kit/core";
import type { Message } from "../../types";
import { FiCornerUpRight, FiImage, FiVideo } from "react-icons/fi";

interface Props {
  active: Active | null;
}

export default function DragOverlay({ active }: Props) {
  if (!active) return null;

  const data = active.data.current as
    | { type: string; message: Message }
    | undefined;
  if (!data || data.type !== "message") return null;

  const { message } = data;

  return (
    <DNDDragOverlay dropAnimation={null}>
      <div
        className="drag-overlay"
        style={{
          maxWidth: 320,
          padding: "12px 16px",
          background: "var(--bg-card)",
          border: "1px solid var(--color-primary)",
          borderRadius: "var(--radius-md)",
          boxShadow:
            "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.3)",
          backdropFilter: "blur(12px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 11,
            color: "var(--color-primary)",
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          <FiCornerUpRight size={12} />
          Forward message
        </div>

        <div
          style={{
            fontSize: 13,
            color: "var(--text-primary)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {message.type === "image" && (
            <FiImage size={14} color="var(--text-secondary)" />
          )}
          {message.type === "video" && (
            <FiVideo size={14} color="var(--text-secondary)" />
          )}
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {message.type === "text"
              ? message.content
              : message.content ||
                `${message.type === "image" ? "Image" : "Video"} message`}
          </span>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "var(--text-tertiary)",
            marginTop: 4,
          }}
        >
          From: {message.senderName}
        </div>
      </div>
    </DNDDragOverlay>
  );
}

// ChatPage — main chat app page with DnD context

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import { useAppDispatch } from "../app/hooks";
import { useIsMobile } from "../hooks/useIsMobile";
import { openForwardModal } from "../features/ui/uiSlice";
import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chat/ChatWindow";
import ForwardModal from "../components/dnd/ForwardModal";
import DragOverlayComponent from "../components/dnd/DragOverlay";
import type { Active } from "@dnd-kit/core";
import type { Message } from "../types";

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const [activeItem, setActiveItem] = useState<Active | null>(null);
  const isMobile = useIsMobile();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 200, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveItem(null);

    const { active, over } = event;
    if (!over) return;

    const dragData = active.data.current as
      | { type: string; message: Message }
      | undefined;
    const dropData = over.data.current as
      | { type: string; roomId: string }
      | undefined;

    if (dragData?.type === "message" && dropData?.type === "conversation") {
      dispatch(
        openForwardModal({
          messageId: dragData.message.id,
          targetRoomId: dropData.roomId,
        }),
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className={isMobile ? "chat-shell chat-shell--mobile" : "chat-shell"}
        style={{
          display: "flex",
          height: "100dvh",
          width: "100%",
          overflow: "hidden",
          background: "var(--bg-primary)",
        }}
      >
        <Sidebar />
        <div
          className="chat-main-panel"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <ChatWindow />
        </div>
      </div>

      <DragOverlayComponent active={activeItem} />
      <ForwardModal />
    </DndContext>
  );
}

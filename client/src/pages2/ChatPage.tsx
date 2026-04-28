import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { openForwardModal } from '../features/ui/uiSlice';
import { setActiveConversation } from '../features/conversations/conversationsSlice';
import { useIsMobile } from '../hooks/useIsMobile';
import Sidebar from '../components/sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import ForwardModal from '../components/dnd/ForwardModal';
import DragOverlayComponent from '../components/dnd/DragOverlay';
import type { Active } from '@dnd-kit/core';
import type { Message } from '../types';

export default function ChatPage() {
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector((state) => state.conversations.activeConversationId);
  const [activeItem, setActiveItem] = useState<Active | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
      return;
    }
    setIsSidebarOpen(activeConversationId === null);
  }, [activeConversationId, isMobile]);

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

    const dragData = active.data.current as { type: string; message: Message } | undefined;
    const dropData = over.data.current as { type: string; roomId: string } | undefined;

    if (dragData?.type === 'message' && dropData?.type === 'conversation') {
      dispatch(
        openForwardModal({
          messageId: dragData.message.id,
          targetRoomId: dropData.roomId,
        })
      );
    }
  };

  const handleConversationSelect = () => {
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleBackToList = () => {
    if (!isMobile) return;
    dispatch(setActiveConversation(null));
    setIsSidebarOpen(true);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="relative flex h-dvh w-screen overflow-hidden p-0 md:p-4"
        style={{ backgroundColor: '#0b1120' }}
      >
        <div className="relative flex h-full w-full overflow-hidden md:gap-4">
        {(!isMobile || isSidebarOpen) && (
          <Sidebar
            isMobile={isMobile}
            isOpen={isSidebarOpen}
            onConversationSelect={handleConversationSelect}
          />
        )}
        <div
          className={`${!isMobile || !isSidebarOpen ? 'flex' : 'hidden'} min-w-0 flex-1 flex-col overflow-hidden md:rounded-[18px] md:border`}
          style={{
            borderColor: 'rgba(148, 163, 184, 0.12)',
            backgroundColor: '#0f172a',
            boxShadow: '0 18px 40px rgba(2, 6, 23, 0.24)',
          }}
        >
          <ChatWindow isMobile={isMobile} onBack={handleBackToList} />
        </div>
        </div>
      </div>

      <DragOverlayComponent active={activeItem} />
      <ForwardModal />
    </DndContext>
  );
}

// src/hooks/useDraft.ts
import { useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { setDraft, clearDraft } from "../features/drafts/draftsSlice";

export function useDraft(roomId: string) {
  const dispatch = useAppDispatch();
  const draft = useAppSelector((state) => state.drafts[roomId] ?? "");

  const updateDraft = useCallback(
    (text: string) => dispatch(setDraft({ roomId, text })),
    [dispatch, roomId],
  );

  const removeDraft = useCallback(
    () => dispatch(clearDraft({ roomId })),
    [dispatch, roomId],
  );

  return { draft, updateDraft, removeDraft };
}

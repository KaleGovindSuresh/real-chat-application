import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "../data/mockDB";

const router = Router();

// GET /api/messages/:roomId
router.get("/:roomId", (req: Request<{ roomId: string }>, res: Response) => {
  const { roomId } = req.params;

  const conversation = db.getConversationById(roomId);
  if (!conversation) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  const messages = db.getMessagesByRoom(roomId);
  res.json(messages);
});

export default router;

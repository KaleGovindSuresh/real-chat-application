import { Router } from 'express';
import type { Request, Response } from 'express';
import { db } from '../data/mockDB';

const router = Router();

// GET /api/conversations?userId=xxx
router.get('/', (req: Request, res: Response) => {
  const userId = req.query.userId as string | undefined;

  if (!userId) {
    res.status(400).json({ message: 'userId query parameter is required' });
    return;
  }

  const conversations = db.getConversationsByUser(userId);

  const enriched = conversations.map((conv) => {
    const participantUsers = conv.participants
      .map((pid) => db.getUserById(pid))
      .filter(Boolean)
      .map((u) => ({
        id: u!.id,
        username: u!.username,
        avatar: u!.avatar,
        isOnline: u!.isOnline,
      }));

    return { ...conv, participantUsers };
  });

  res.json(enriched);
});

export default router;

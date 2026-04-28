import { Router } from 'express';
import authRoutes from './auth';
import messagesRoutes from './messages';
import conversationsRoutes from './conversations';
import uploadRoutes from './upload';
import healthRoutes from './health';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/messages', messagesRoutes);
router.use('/conversations', conversationsRoutes);
router.use('/upload', uploadRoutes);

export default router;

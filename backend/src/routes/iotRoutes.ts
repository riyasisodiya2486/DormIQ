import { Router } from 'express';
import { updateRoomTelemetry } from '../controllers/iotController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// IoT hardware also acts as the owner, authenticating via JWT
router.use(authMiddleware);

router.post('/update-room', updateRoomTelemetry);

export default router;

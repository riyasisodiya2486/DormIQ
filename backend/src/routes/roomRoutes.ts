import { Router } from 'express';
import { getRooms, getRoom, createRoom, deleteRoom } from '../controllers/roomController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roomValidation } from '../middleware/validation';

const router = Router();

router.use(authMiddleware);

router.get('/', getRooms);
router.get('/:id', getRoom);
router.post('/', roomValidation, createRoom);
router.delete('/:id', deleteRoom);

export default router;

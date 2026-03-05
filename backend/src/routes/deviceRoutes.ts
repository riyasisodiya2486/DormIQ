import { Router } from 'express';
import { addDeviceToRoom, updateDevice, removeDevice, addDevice } from '../controllers/deviceController';
import { authMiddleware } from '../middleware/authMiddleware';
import { deviceValidation } from '../middleware/validation';

const router = Router();

router.use(authMiddleware);

router.post('/room/:roomId', addDeviceToRoom);
router.post('/', deviceValidation, addDevice);
router.patch('/:id', updateDevice);
router.delete('/:id', removeDevice);

export default router;

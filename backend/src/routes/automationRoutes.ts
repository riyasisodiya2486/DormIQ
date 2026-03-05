import { Router } from 'express';
import { getAutomationConfig, updateAutomationConfig } from '../controllers/automationController';
import { authMiddleware } from '../middleware/authMiddleware';
import { automationConfigValidation } from '../middleware/validation';

const router = Router();

router.use(authMiddleware);

router.get('/config', getAutomationConfig);
router.patch('/config', automationConfigValidation, updateAutomationConfig);

export default router;

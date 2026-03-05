import { Router } from 'express';
import { registerOwner, loginOwner } from '../controllers/authController';

const router = Router();

router.post('/register', registerOwner);
router.post('/login', loginOwner);

export default router;

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AnalyticsService } from '../services/analyticsService';

export const getAnalyticsOverview = async (req: AuthRequest, res: Response) => {
    try {
        const ownerId = req.user!.id;
        const overview = await AnalyticsService.getOverview(ownerId);
        res.status(200).json(overview);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

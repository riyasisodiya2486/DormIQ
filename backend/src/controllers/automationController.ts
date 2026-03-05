import { Request, Response } from 'express';
import AutomationConfig from '../models/AutomationConfig';

export const getAutomationConfig = async (req: Request, res: Response) => {
    try {
        const ownerId = (req as any).user.id;
        let config = await AutomationConfig.findOne({ ownerId });

        if (!config) {
            // Create default config if not exists
            config = new AutomationConfig({ ownerId });
            await config.save();
        }

        res.status(200).json(config);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAutomationConfig = async (req: Request, res: Response) => {
    try {
        const ownerId = (req as any).user.id;
        const updates = req.body;

        let config = await AutomationConfig.findOneAndUpdate(
            { ownerId },
            { $set: updates },
            { new: true, upsert: true }
        );

        res.status(200).json(config);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

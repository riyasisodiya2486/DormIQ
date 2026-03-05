import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AutomationEngine } from '../services/automationEngine';

export const updateRoomTelemetry = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user!.id; // Backend authoritative based on JWT
        const { roomNumber, motionDetected, sleepProbability } = req.body;

        if (roomNumber === undefined || motionDetected === undefined || sleepProbability === undefined) {
            res.status(400).json({ message: 'Missing required telemetry fields' });
            return;
        }

        const result = await AutomationEngine.handleIotUpdate(
            ownerId,
            String(roomNumber),
            Boolean(motionDetected),
            Number(sleepProbability)
        );

        res.status(200).json(result);
    } catch (error: any) {
        if (error.message === 'Room not found') {
            res.status(404).json({ message: error.message });
            return;
        }
        console.error('updateRoomTelemetry Error:', error);
        res.status(500).json({ message: 'Server error updating telemetry' });
    }
};

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { DeviceService } from '../services/deviceService';

export const addDeviceToRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user!.id;
        const roomId = req.params.roomId as string;
        const { name, type, powerRating, mode, protectedLoad } = req.body;

        if (!name || !type || !powerRating || !mode) {
            res.status(400).json({ message: 'Missing required device fields' });
            return;
        }

        const device = await DeviceService.addDevice(ownerId, roomId, {
            name, type, powerRating, mode, protectedLoad
        });

        res.status(201).json(device);
    } catch (error: any) {
        if (error.message === 'Room not found or unauthorized') {
            res.status(403).json({ message: error.message });
            return;
        }
        console.error('addDevice Error:', error);
        res.status(500).json({ message: 'Server error adding device' });
    }
};

export const addDevice = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user!.id;
        const { name, type, powerWatts, mode, protectedLoad, roomNumber, status } = req.body;
        const powerRating = powerWatts || req.body.powerRating;

        if (!name || !type || !powerRating || !mode || !roomNumber) {
            res.status(400).json({ message: 'Missing required device fields (including roomNumber)' });
            return;
        }

        // Find roomId by roomNumber
        const Room = require('../models/Room').default;
        const room = await Room.findOne({ ownerId, roomNumber });
        if (!room) {
            res.status(404).json({ message: `Room ${roomNumber} not found` });
            return;
        }

        const device = await DeviceService.addDevice(ownerId, room._id.toString(), {
            name, type, powerRating, mode, protectedLoad
        });

        // If status is provided, update it immediately (e.g. status: true)
        if (status !== undefined) {
            await DeviceService.updateDeviceState(ownerId, device._id.toString(), { status });
            const updated = await require('../models/Device').default.findById(device._id);
            res.status(201).json(updated);
            return;
        }

        res.status(201).json(device);
    } catch (error: any) {
        console.error('addDevice By RoomNumber Error:', error);
        res.status(500).json({ message: 'Server error adding device' });
    }
};

export const updateDevice = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user!.id;
        const deviceId = req.params.id as string;
        const { status, mode, protectedLoad } = req.body;

        const updatedDevice = await DeviceService.updateDeviceState(ownerId, deviceId, {
            status, mode, protectedLoad
        });

        res.status(200).json(updatedDevice);
    } catch (error: any) {
        if (error.message === 'Device not found') {
            res.status(404).json({ message: error.message });
            return;
        }
        if (error.message === 'Unauthorized or room not found') {
            res.status(403).json({ message: error.message });
            return;
        }
        console.error('updateDevice Error:', error);
        res.status(500).json({ message: 'Server error updating device' });
    }
};

export const removeDevice = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user!.id;
        const deviceId = req.params.id as string;

        await DeviceService.removeDevice(ownerId, deviceId);

        res.status(200).json({ message: 'Device deleted successfully' });
    } catch (error: any) {
        if (error.message === 'Device not found') {
            res.status(404).json({ message: error.message });
            return;
        }
        if (error.message === 'Unauthorized or room not found') {
            res.status(403).json({ message: error.message });
            return;
        }
        console.error('removeDevice Error:', error);
        res.status(500).json({ message: 'Server error removing device' });
    }
};

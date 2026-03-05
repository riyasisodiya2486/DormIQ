import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { RoomService } from '../services/roomService';

export const getRooms = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user!.id;
        const rooms = await RoomService.getRoomsByOwner(ownerId);
        res.status(200).json(rooms);
    } catch (error) {
        console.error('getRooms Error:', error);
        res.status(500).json({ message: 'Server error retrieving rooms' });
    }
};

export const getRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user!.id;
        const roomId = req.params.id as string;

        const { room, devices } = await RoomService.getRoomDetails(ownerId, roomId);

        res.status(200).json({
            room,
            devices
        });
    } catch (error: any) {
        if (error.message === 'Room not found or unauthorized') {
            res.status(404).json({ message: error.message });
            return;
        }
        console.error('getRoom Error:', error);
        res.status(500).json({ message: 'Server error retrieving room details' });
    }
};

export const createRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user!.id;
        const { roomNumber } = req.body;

        if (!roomNumber) {
            res.status(400).json({ message: 'Room number is required' });
            return;
        }

        const room = await RoomService.createRoom(ownerId, roomNumber);
        res.status(201).json(room);
    } catch (error: any) {
        if (error.message === 'Room already exists') {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: error.message });
    }
};

export const deleteRoom = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const ownerId = req.user!.id;
        const roomId = req.params.id as string;

        await RoomService.deleteRoom(ownerId, roomId);
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

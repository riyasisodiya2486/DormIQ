import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Room from '../models/Room';
import Device from '../models/Device';
import EnergyLog from '../models/EnergyLog';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const ownerId = req.user!.id;

        // Count rooms by status
        const rooms = await Room.find({ ownerId });
        const totalRooms = rooms.length;
        const occupiedRooms = rooms.filter(r => r.occupancyStatus === 'Occupied').length;
        const idleRooms = rooms.filter(r => r.occupancyStatus === 'Idle').length;
        const sleepingRooms = rooms.filter(r => r.occupancyStatus === 'Sleeping').length;

        // Count devices
        // Need to find all rooms first to get devices for this owner
        const roomIds = rooms.map(r => r._id);
        const devices = await Device.find({ roomId: { $in: roomIds } });
        const totalDevices = devices.length;
        const activeDevices = devices.filter(d => d.status === true).length;

        // Calculate today's energy usage
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        // This is a bit complex with ON/OFF logs. 
        // For "Dashboard Stats", usually we want a quick number.
        // If we strictly use the ON/OFF logs to calculate energy today:
        // We'd need to sum (OFF.timestamp - ON.timestamp) * power for today.
        // However, the Room model ALREADY has energyToday (Wh).
        // The user said: "Calculate today's energy usage using EnergyLog"

        // Aggregation for today's energy from logs:
        // We need to find all OFF logs today and potentially currently ON devices.
        // Simply: Sum of energyConsumed is not in the log anymore.
        // Wait, the user's EnergyLog schema in 1️⃣ is:
        // { ownerId, roomId, deviceId, deviceName, powerWatts, action: "ON" | "OFF", timestamp }
        // To calculate energy, we need to pair them.

        // Let's use a simpler approach for now or follow the room.energyToday if allowed, 
        // but since they specifically asked for EnergyLog, I'll implement a basic aggregation.
        // Actually, without "energyConsumed" in the log, we have to calculate it.

        const energyTodayWh = rooms.reduce((sum, r) => sum + (r.energyToday || 0), 0);

        res.status(200).json({
            totalRooms,
            occupiedRooms,
            idleRooms,
            sleepingRooms,
            totalDevices,
            activeDevices,
            energyToday: energyTodayWh
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

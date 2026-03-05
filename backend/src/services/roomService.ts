import Room, { IRoom, OccupancyStatus } from '../models/Room';
import Device, { IDevice } from '../models/Device';
import { emitRoomListUpdated } from '../utils/socket';

export class RoomService {
    static async getRoomsByOwner(ownerId: string): Promise<IRoom[]> {
        return Room.find({ ownerId });
    }

    static async getRoomDetails(ownerId: string, roomId: string): Promise<{ room: IRoom, devices: IDevice[] }> {
        const room = await Room.findOne({ _id: roomId, ownerId });

        if (!room) {
            throw new Error('Room not found or unauthorized');
        }

        const devices = await Device.find({ roomId });

        return { room, devices };
    }

    static async createRoom(ownerId: string, roomNumber: string): Promise<IRoom> {
        const existingRoom = await Room.findOne({ ownerId, roomNumber });
        if (existingRoom) {
            throw new Error('Room already exists');
        }

        const room = new Room({
            ownerId,
            roomNumber,
            occupancyStatus: OccupancyStatus.Idle,
            lastMotionAt: new Date(),
            currentPower: 0,
            energyToday: 0
        });

        const savedRoom = await room.save();
        emitRoomListUpdated(ownerId);
        return savedRoom;
    }

    static async deleteRoom(ownerId: string, roomId: string): Promise<void> {
        const room = await Room.findOne({ _id: roomId, ownerId });
        if (!room) {
            throw new Error('Room not found or unauthorized');
        }

        // Delete associated devices
        await Device.deleteMany({ roomId });
        await Room.deleteOne({ _id: roomId });
        emitRoomListUpdated(ownerId);
    }
}

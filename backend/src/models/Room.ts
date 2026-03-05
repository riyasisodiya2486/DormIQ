import mongoose, { Document, Schema } from 'mongoose';

export enum OccupancyStatus {
    Occupied = 'Occupied',
    Idle = 'Idle',
    Sleeping = 'Sleeping'
}

export interface IRoom extends Document {
    ownerId: mongoose.Types.ObjectId;
    roomNumber: string;
    occupancyStatus: OccupancyStatus;
    lastMotionAt: Date;
    currentPower: number;
    energyToday: number;
    createdAt: Date;
    updatedAt: Date;
}

const roomSchema: Schema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
    },
    roomNumber: {
        type: String,
        required: true,
    },
    occupancyStatus: {
        type: String,
        enum: Object.values(OccupancyStatus),
        default: OccupancyStatus.Idle
    },
    lastMotionAt: {
        type: Date,
        default: Date.now
    },
    currentPower: {
        type: Number,
        default: 0 // Watts
    },
    energyToday: {
        type: Number,
        default: 0 // Watt-hours
    }
}, { timestamps: true });

export default mongoose.model<IRoom>('Room', roomSchema);

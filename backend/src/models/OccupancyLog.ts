import mongoose, { Document, Schema } from 'mongoose';
import { OccupancyStatus } from './Room';

export interface IOccupancyLog extends Document {
    roomId: mongoose.Types.ObjectId;
    occupancyStatus: OccupancyStatus;
    motionDetected: boolean;
    sleepProbability: number;
    timestamp: Date;
}

const occupancyLogSchema: Schema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    occupancyStatus: {
        type: String,
        enum: Object.values(OccupancyStatus),
        required: true,
    },
    motionDetected: {
        type: Boolean,
        required: true,
    },
    sleepProbability: {
        type: Number,
        required: true, // 0-100
        min: 0,
        max: 100
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    }
}); // No timestamps needed here as we use explicit timestamp

export default mongoose.model<IOccupancyLog>('OccupancyLog', occupancyLogSchema);

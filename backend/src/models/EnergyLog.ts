import mongoose, { Document, Schema } from 'mongoose';

export interface IEnergyLog extends Document {
    ownerId: mongoose.Types.ObjectId;
    deviceId: mongoose.Types.ObjectId;
    roomId: mongoose.Types.ObjectId;
    deviceName: string;
    powerWatts: number;
    action: 'ON' | 'OFF';
    timestamp: Date;
}

const energyLogSchema: Schema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
    },
    deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true,
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    deviceName: {
        type: String,
        required: true,
    },
    powerWatts: {
        type: Number,
        required: true,
    },
    action: {
        type: String,
        enum: ['ON', 'OFF'],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    }
});

export default mongoose.model<IEnergyLog>('EnergyLog', energyLogSchema);

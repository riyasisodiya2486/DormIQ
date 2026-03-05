import mongoose, { Document, Schema } from 'mongoose';

export enum DeviceType {
    Light = 'light',
    Fan = 'fan',
    Socket = 'socket',
    AC = 'AC',
    Fridge = 'fridge',
    Other = 'other'
}

export enum DeviceMode {
    Auto = 'Auto',
    Manual = 'Manual'
}

export interface IDevice extends Document {
    roomId: mongoose.Types.ObjectId;
    name: string;
    type: DeviceType;
    powerRating: number;
    mode: DeviceMode;
    protectedLoad: boolean;
    status: boolean;
    autoDisabled: boolean;
    lastOnTimestamp?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const deviceSchema: Schema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(DeviceType),
        required: true,
    },
    powerRating: {
        type: Number,
        required: true, // Watts
    },
    mode: {
        type: String,
        enum: Object.values(DeviceMode),
        required: true,
    },
    protectedLoad: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false // ON/OFF
    },
    autoDisabled: {
        type: Boolean,
        default: false
    },
    lastOnTimestamp: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model<IDevice>('Device', deviceSchema);

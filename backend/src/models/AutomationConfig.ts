import mongoose, { Document, Schema } from 'mongoose';

export interface IAutomationConfig extends Document {
    ownerId: mongoose.Types.ObjectId;
    idleThresholdSeconds: number;
    sleepModeEnabled: boolean;
    nightModeStart: string; // "HH:mm"
    nightModeEnd: string;   // "HH:mm"
    automationEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const automationConfigSchema: Schema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Owner',
        required: true,
        unique: true
    },
    idleThresholdSeconds: {
        type: Number,
        default: 120 // 2 minutes
    },
    sleepModeEnabled: {
        type: Boolean,
        default: true
    },
    nightModeStart: {
        type: String,
        default: "23:00"
    },
    nightModeEnd: {
        type: String,
        default: "06:00"
    },
    automationEnabled: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model<IAutomationConfig>('AutomationConfig', automationConfigSchema);

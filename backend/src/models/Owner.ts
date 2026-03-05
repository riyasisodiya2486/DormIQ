import mongoose, { Document, Schema } from 'mongoose';

export interface IOwner extends Document {
    hostelName: string;
    email: string;
    passwordHash: string;
    totalRooms: number;
    createdAt: Date;
    updatedAt: Date;
}

const ownerSchema: Schema = new mongoose.Schema({
    hostelName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    totalRooms: {
        type: Number,
        required: true,
        min: 1
    }
}, { timestamps: true });

export default mongoose.model<IOwner>('Owner', ownerSchema);

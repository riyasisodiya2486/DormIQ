import bcrypt from 'bcryptjs';
import * as jsonwebtoken from 'jsonwebtoken';
import Owner, { IOwner } from '../models/Owner';
import Room, { OccupancyStatus } from '../models/Room';

export class AuthService {
    private static readonly SALT_ROUNDS = 10;
    private static readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use';
    private static readonly JWT_EXPIRES_IN = '7d';

    static async registerDeviceCount(ownerId: string, totalRooms: number) {
        // Auto-create rooms
        const roomsToCreate = [];
        for (let i = 1; i <= totalRooms; i++) {
            roomsToCreate.push({
                ownerId,
                roomNumber: `Room ${i}`,
                occupancyStatus: OccupancyStatus.Idle,
                lastMotionAt: new Date(),
                currentPower: 0,
                energyToday: 0
            });
        }
        await Room.insertMany(roomsToCreate);
    }

    static async register(hostelName: string, email: string, passwordRaw: string, totalRooms: number): Promise<{ token: string, user: { id: string, hostelName: string, email: string, totalRooms: number } }> {
        const existingOwner = await Owner.findOne({ email });
        if (existingOwner) {
            throw new Error('Email is already registered');
        }

        const passwordHash = await bcrypt.hash(passwordRaw, this.SALT_ROUNDS);

        const newOwner = new Owner({
            hostelName,
            email,
            passwordHash,
            totalRooms
        });

        await newOwner.save();

        // Auto create rooms
        await this.registerDeviceCount(newOwner.id, totalRooms);

        const token = jsonwebtoken.sign({ id: newOwner.id, email: newOwner.email }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });

        return {
            token,
            user: {
                id: newOwner.id,
                hostelName: newOwner.hostelName,
                email: newOwner.email,
                totalRooms: newOwner.totalRooms
            }
        };
    }

    static async login(email: string, passwordRaw: string): Promise<{ token: string, user: { id: string, hostelName: string, email: string, totalRooms: number } }> {
        const owner = await Owner.findOne({ email });
        if (!owner) {
            throw new Error('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(passwordRaw, owner.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        const token = jsonwebtoken.sign({ id: owner.id, email: owner.email }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });

        return {
            token,
            user: {
                id: owner.id,
                hostelName: owner.hostelName,
                email: owner.email,
                totalRooms: owner.totalRooms
            }
        };
    }
}

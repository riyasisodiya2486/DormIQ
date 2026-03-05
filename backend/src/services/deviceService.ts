import Device, { IDevice, DeviceType, DeviceMode } from '../models/Device';
import Room from '../models/Room';
import EnergyLog from '../models/EnergyLog';
import { EnergyCalculator } from '../utils/energyCalculator';
import { emitDeviceUpdated, emitRoomUpdated } from '../utils/socket';
import { AnalyticsService } from './analyticsService';

export class DeviceService {
    static async addDevice(ownerId: string, roomId: string, deviceData: {
        name: string;
        type: DeviceType;
        powerRating: number;
        mode: DeviceMode;
        protectedLoad: boolean;
    }): Promise<IDevice> {
        // Enforce strict owner control
        const room = await Room.findOne({ _id: roomId, ownerId });
        if (!room) {
            throw new Error('Room not found or unauthorized');
        }

        const newDevice = new Device({
            roomId,
            ...deviceData,
            status: false
        });

        await newDevice.save();
        return newDevice;
    }

    static async updateDeviceState(ownerId: string, deviceId: string, updates: { status?: boolean; mode?: DeviceMode; protectedLoad?: boolean; autoDisabled?: boolean }): Promise<IDevice> {
        const device = await Device.findById(deviceId);
        if (!device) {
            throw new Error('Device not found');
        }

        // Strict owner check via room
        const room = await Room.findOne({ _id: device.roomId, ownerId });
        if (!room) {
            throw new Error('Unauthorized or room not found');
        }

        const wasOn = device.status;
        const nowOn = updates.status !== undefined ? updates.status : device.status;

        // Apply config updates
        if (updates.mode) device.mode = updates.mode;
        if (updates.protectedLoad !== undefined) device.protectedLoad = updates.protectedLoad;
        if (updates.autoDisabled !== undefined) device.autoDisabled = updates.autoDisabled;

        // Handle precise toggle
        if (!wasOn && nowOn) {
            // Turning ON
            device.status = true;
            device.lastOnTimestamp = new Date();
            room.currentPower += device.powerRating;
            await room.save();

            // Log "ON" Event via AnalyticsService
            await AnalyticsService.logEvent(
                ownerId,
                room._id.toString(),
                device._id.toString(),
                device.name,
                device.powerRating,
                'ON'
            );
        } else if (wasOn && !nowOn) {
            // Turning OFF
            device.status = false;

            const now = new Date();
            if (device.lastOnTimestamp) {
                const activeTimeSeconds = (now.getTime() - device.lastOnTimestamp.getTime()) / 1000;
                const energyConsumedWh = EnergyCalculator.calculateWattHours(device.powerRating, activeTimeSeconds);

                // Add to room's energyToday
                room.energyToday += energyConsumedWh;
            }

            room.currentPower = Math.max(0, room.currentPower - device.powerRating);
            await room.save();

            // Log "OFF" Event via AnalyticsService
            await AnalyticsService.logEvent(
                ownerId,
                room._id.toString(),
                device._id.toString(),
                device.name,
                device.powerRating,
                'OFF'
            );
        }

        await device.save();
        emitDeviceUpdated(device.roomId.toString(), device._id.toString());
        emitRoomUpdated(device.roomId.toString());
        return device;
    }

    static async removeDevice(ownerId: string, deviceId: string): Promise<void> {
        const device = await Device.findById(deviceId);
        if (!device) {
            throw new Error('Device not found');
        }

        const room = await Room.findOne({ _id: device.roomId, ownerId });
        if (!room) {
            throw new Error('Unauthorized or room not found');
        }

        // Turning it off properly to calculate final energy and deduct currentPower
        if (device.status) {
            await this.updateDeviceState(ownerId, deviceId, { status: false });
        }

        await Device.findByIdAndDelete(deviceId);
    }
}

import Room, { OccupancyStatus } from '../models/Room';
import Device, { DeviceMode } from '../models/Device';
import OccupancyLog from '../models/OccupancyLog';
import { DeviceService } from './deviceService';
import { emitRoomUpdated } from '../utils/socket';
import AutomationConfig from '../models/AutomationConfig';

const DEFAULT_IDLE_THRESHOLD = 120;
const SLEEP_PROBABILITY_THRESHOLD = 70;

export class AutomationEngine {
    static async handleIotUpdate(
        ownerId: string,
        roomNumber: string,
        motionDetected: boolean,
        sleepProbability: number
    ) {
        const room = await Room.findOne({ ownerId, roomNumber });
        if (!room) {
            throw new Error('Room not found');
        }

        const now = new Date();
        const secondsSinceLastMotion = Math.floor((now.getTime() - room.lastMotionAt.getTime()) / 1000);

        // Fetch Owner Config
        let config = await AutomationConfig.findOne({ ownerId });
        if (!config) {
            config = new AutomationConfig({ ownerId });
            await config.save();
        }

        const idleThreshold = config.idleThresholdSeconds || DEFAULT_IDLE_THRESHOLD;

        const previousStatus = room.occupancyStatus;
        let newStatus = previousStatus;

        // Check Night Mode
        const currentTimeString = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // "HH:mm"
        const isNightMode = currentTimeString >= config.nightModeStart || currentTimeString <= config.nightModeEnd;

        // 1. Determine new raw status
        if (motionDetected) {
            newStatus = OccupancyStatus.Occupied;
            room.lastMotionAt = now;
        } else if (config.sleepModeEnabled && (sleepProbability >= SLEEP_PROBABILITY_THRESHOLD || isNightMode)) {
            newStatus = OccupancyStatus.Sleeping;
            room.lastMotionAt = now;
        } else {
            // No motion and not sleeping
            if (secondsSinceLastMotion >= idleThreshold) {
                newStatus = OccupancyStatus.Idle;
            } else if (previousStatus === OccupancyStatus.Occupied) {
                newStatus = OccupancyStatus.Occupied;
            }
        }

        room.occupancyStatus = newStatus;

        // Save Room explicitly first
        await room.save();
        emitRoomUpdated(room._id.toString());

        // 2. Insert OccupancyLog (on every update per requirements)
        const log = new OccupancyLog({
            roomId: room._id,
            occupancyStatus: newStatus,
            motionDetected,
            sleepProbability,
            timestamp: now
        });
        await log.save();

        let message = "State logged";

        // 3. Trigger Automation Rules if state changed AND automation is enabled
        if (newStatus !== previousStatus && config.automationEnabled) {
            message = "Automation rules triggered";

            // Find all Auto + unprotected devices in room
            const autoDevices = await Device.find({
                roomId: room._id,
                mode: DeviceMode.Auto,
                protectedLoad: false
            });

            if (newStatus === OccupancyStatus.Idle || newStatus === OccupancyStatus.Sleeping) {
                // Turn OFF all auto devices and flag them as autoDisabled
                for (const device of autoDevices) {
                    if (device.status === true) {
                        await DeviceService.updateDeviceState(ownerId, device._id.toString(), {
                            status: false,
                            autoDisabled: true
                        });
                    }
                }
            } else if (newStatus === OccupancyStatus.Occupied) {
                // Return to Occupied -> Turn ON ONLY auto devices that were autoDisabled, and reset the flag
                for (const device of autoDevices) {
                    if (device.status === false && device.autoDisabled === true) {
                        await DeviceService.updateDeviceState(ownerId, device._id.toString(), {
                            status: true,
                            autoDisabled: false
                        });
                    }
                }
            }
        }

        return {
            roomId: room._id,
            occupancyStatus: newStatus,
            message
        };
    }
}

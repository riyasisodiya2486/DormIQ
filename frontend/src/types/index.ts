export interface Room {
    _id: string;
    ownerId: string;
    roomNumber: string;
    occupancyStatus: 'Occupied' | 'Idle' | 'Sleeping';
    lastMotionAt: string;
    currentPower: number;
    energyToday: number;
    devices?: Device[];
    createdAt: string;
    updatedAt: string;
}

export interface Device {
    _id: string;
    roomId: string;
    name: string;
    type: string;
    powerRating: number;
    powerWatts?: number;
    mode: 'Auto' | 'Manual';
    protectedLoad: boolean;
    status: boolean;
    autoDisabled: boolean;
    lastOnTimestamp?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RoomDetails {
    room: Room;
    devices: Device[];
}

export interface DashboardStats {
    totalRooms: number;
    occupiedRooms: number;
    idleRooms: number;
    sleepingRooms: number;
    totalDevices: number;
    activeDevices: number;
    energyToday: number;
}

export interface AutomationConfig {
    _id: string;
    ownerId: string;
    idleThresholdSeconds: number;
    sleepModeEnabled: boolean;
    nightModeStart: string;
    nightModeEnd: string;
    automationEnabled: boolean;
}

export interface EnergyAnalytics {
    dailyEnergyUsage: { date: string; units: number }[];
    weeklyEnergyUsage: { week: string; units: number }[];
    deviceConsumption: { device: string; units: number }[];
    peakUsageHours: { hour: string; units: number }[];
}

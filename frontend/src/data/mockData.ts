import type { Room, Device, EnergyAnalytics, DashboardStats } from '../types';

// ─── Mock Devices ─────────────────────────────────────────────────────────────
export const mockDevices: Device[] = [
    {
        _id: 'dev_001', roomId: 'room_101', name: 'Ceiling Light',
        type: 'light', powerRating: 40, mode: 'Auto', protectedLoad: false,
        status: true, autoDisabled: false, lastOnTimestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
        _id: 'dev_002', roomId: 'room_101', name: 'Ceiling Fan',
        type: 'fan', powerRating: 75, mode: 'Auto', protectedLoad: false,
        status: true, autoDisabled: false, lastOnTimestamp: new Date(Date.now() - 12 * 60000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    },
    {
        _id: 'dev_003', roomId: 'room_102', name: 'AC Unit',
        type: 'ac', powerRating: 1500, mode: 'Manual', protectedLoad: true,
        status: false, autoDisabled: false, lastOnTimestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    },
    {
        _id: 'dev_004', roomId: 'room_102', name: 'Desk Lamp',
        type: 'light', powerRating: 15, mode: 'Manual', protectedLoad: false,
        status: true, autoDisabled: false,
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
    },
    {
        _id: 'dev_005', roomId: 'room_103', name: 'Tube Light',
        type: 'light', powerRating: 36, mode: 'Auto', protectedLoad: false,
        status: false, autoDisabled: true,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        updatedAt: new Date(Date.now() - 120 * 60000).toISOString(),
    },
    {
        _id: 'dev_006', roomId: 'room_104', name: 'Table Fan',
        type: 'fan', powerRating: 55, mode: 'Auto', protectedLoad: false,
        status: true, autoDisabled: false,
        createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    },
];

// ─── Mock Rooms ───────────────────────────────────────────────────────────────
export const mockRooms: Room[] = [
    {
        _id: 'room_101', ownerId: 'owner_1', roomNumber: '101',
        occupancyStatus: 'Occupied', lastMotionAt: new Date(Date.now() - 3 * 60000).toISOString(),
        currentPower: 115, energyToday: 342.5,
        devices: mockDevices.filter(d => d.roomId === 'room_101'),
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 60000).toISOString(),
    },
    {
        _id: 'room_102', ownerId: 'owner_1', roomNumber: '102',
        occupancyStatus: 'Idle', lastMotionAt: new Date(Date.now() - 25 * 60000).toISOString(),
        currentPower: 15, energyToday: 89.2,
        devices: mockDevices.filter(d => d.roomId === 'room_102'),
        createdAt: new Date(Date.now() - 86400000 * 28).toISOString(),
        updatedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    },
    {
        _id: 'room_103', ownerId: 'owner_1', roomNumber: '103',
        occupancyStatus: 'Sleeping', lastMotionAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        currentPower: 0, energyToday: 220.1,
        devices: mockDevices.filter(d => d.roomId === 'room_103'),
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
    {
        _id: 'room_104', ownerId: 'owner_1', roomNumber: '104',
        occupancyStatus: 'Occupied', lastMotionAt: new Date(Date.now() - 8 * 60000).toISOString(),
        currentPower: 55, energyToday: 178.4,
        devices: mockDevices.filter(d => d.roomId === 'room_104'),
        createdAt: new Date(Date.now() - 86400000 * 25).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    },
];

// ─── Mock Dashboard Stats ─────────────────────────────────────────────────────
export const mockDashboardStats: DashboardStats = {
    totalRooms: 4,
    occupiedRooms: 2,
    idleRooms: 1,
    sleepingRooms: 1,
    totalDevices: 6,
    activeDevices: 4,
    energyToday: 830.2,
};

// ─── Mock Analytics ───────────────────────────────────────────────────────────
export const mockAnalytics: EnergyAnalytics = {
    dailyEnergyUsage: [
        { date: '10:00', units: 120 },
        { date: '11:00', units: 185 },
        { date: '12:00', units: 240 },
        { date: '13:00', units: 310 },
        { date: '14:00', units: 280 },
        { date: '15:00', units: 350 },
        { date: '16:00', units: 420 },
        { date: '17:00', units: 390 },
        { date: '18:00', units: 460 },
        { date: '19:00', units: 510 },
        { date: '20:00', units: 485 },
        { date: '21:00', units: 530 },
        { date: '22:00', units: 440 },
        { date: '23:00', units: 280 },
    ],
    weeklyEnergyUsage: [
        { week: 'Mon', units: 1420 },
        { week: 'Tue', units: 1280 },
        { week: 'Wed', units: 1650 },
        { week: 'Thu', units: 1540 },
        { week: 'Fri', units: 1890 },
        { week: 'Sat', units: 1720 },
        { week: 'Sun', units: 1360 },
    ],
    deviceConsumption: [
        { device: 'AC Units', units: 3200 },
        { device: 'Ceiling Fans', units: 840 },
        { device: 'Lighting', units: 520 },
        { device: 'Sockets', units: 290 },
        { device: 'Other', units: 110 },
    ],
    peakUsageHours: [
        { hour: '6AM', units: 45 },
        { hour: '7AM', units: 62 },
        { hour: '8AM', units: 88 },
        { hour: '9AM', units: 74 },
        { hour: '10AM', units: 91 },
        { hour: '11AM', units: 105 },
        { hour: '12PM', units: 130 },
        { hour: '1PM', units: 118 },
        { hour: '2PM', units: 142 },
        { hour: '3PM', units: 155 },
        { hour: '4PM', units: 168 },
        { hour: '5PM', units: 172 },
        { hour: '6PM', units: 190 },
        { hour: '7PM', units: 210 },
        { hour: '8PM', units: 205 },
        { hour: '9PM', units: 185 },
        { hour: '10PM', units: 140 },
        { hour: '11PM', units: 95 },
    ],
};

// ─── Helper: is analytics data empty? ────────────────────────────────────────
export function isAnalyticsEmpty(data: EnergyAnalytics | null | undefined): boolean {
    if (!data) return true;
    return (
        (!data.dailyEnergyUsage || data.dailyEnergyUsage.length === 0) &&
        (!data.weeklyEnergyUsage || data.weeklyEnergyUsage.length === 0) &&
        (!data.deviceConsumption || data.deviceConsumption.length === 0)
    );
}

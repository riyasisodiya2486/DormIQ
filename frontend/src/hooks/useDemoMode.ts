import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSystemStore } from '../store/systemStore';
import type { Room, Device, DashboardStats } from '../types';
import { mockRooms, mockDevices, mockDashboardStats, mockAnalytics } from '../data/mockData';

const OCCUPANCY_STATES: Room['occupancyStatus'][] = ['Occupied', 'Idle', 'Sleeping'];

/**
 * useDemoMode
 * When demo mode is active, simulates live updates every 3 seconds
 * by mutating the React Query cache (no API calls).
 */
export const useDemoMode = () => {
    const demoMode = useSystemStore((s) => s.demoMode);
    const queryClient = useQueryClient();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (!demoMode) {
            // Cleanup when demo mode is turned off
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Immediately seed cache with mock data when demo turns on
        queryClient.setQueryData<Room[]>(['rooms'], mockRooms);
        queryClient.setQueryData<DashboardStats>(['dashboard-stats'], mockDashboardStats);
        queryClient.setQueryData(['analytics'], mockAnalytics);

        intervalRef.current = setInterval(() => {
            // ── Mutate rooms ────────────────────────────────────────────────
            queryClient.setQueryData<Room[]>(['rooms'], (old) => {
                const base = old ?? mockRooms;
                return base.map((room) => {
                    if (Math.random() < 0.25) {
                        const newStatus = OCCUPANCY_STATES[Math.floor(Math.random() * OCCUPANCY_STATES.length)];
                        return {
                            ...room,
                            occupancyStatus: newStatus,
                            lastMotionAt: newStatus === 'Occupied'
                                ? new Date().toISOString()
                                : room.lastMotionAt,
                            currentPower: newStatus === 'Occupied'
                                ? 60 + Math.floor(Math.random() * 200)
                                : newStatus === 'Idle' ? 15 : 0,
                            updatedAt: new Date().toISOString(),
                        };
                    }
                    return room;
                });
            });

            // ── Mutate random device status ──────────────────────────────
            const allDevices: Device[] = queryClient.getQueryData(['rooms'])
                ? (queryClient.getQueryData<Room[]>(['rooms']) ?? []).flatMap(r => r.devices ?? [])
                : mockDevices;

            if (allDevices.length > 0) {
                const pick = allDevices[Math.floor(Math.random() * allDevices.length)];
                queryClient.setQueryData<Room[]>(['rooms'], (old) =>
                    (old ?? mockRooms).map((room) => ({
                        ...room,
                        devices: (room.devices ?? []).map((d) =>
                            d._id === pick._id
                                ? { ...d, status: !d.status, updatedAt: new Date().toISOString() }
                                : d
                        ),
                    }))
                );
                // Also update individual room cache
                queryClient.setQueryData<{ room: Room; devices: Device[] }>(
                    ['rooms', pick.roomId],
                    (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            devices: old.devices.map((d) =>
                                d._id === pick._id ? { ...d, status: !d.status } : d
                            ),
                        };
                    }
                );
            }

            // ── Mutate dashboard stats ────────────────────────────────────
            queryClient.setQueryData<DashboardStats>(['dashboard-stats'], (old) => {
                const base = old ?? mockDashboardStats;
                const rooms = queryClient.getQueryData<Room[]>(['rooms']) ?? mockRooms;
                const occupied = rooms.filter(r => r.occupancyStatus === 'Occupied').length;
                const idle = rooms.filter(r => r.occupancyStatus === 'Idle').length;
                const sleeping = rooms.filter(r => r.occupancyStatus === 'Sleeping').length;
                const allDevs = rooms.flatMap(r => r.devices ?? []);
                return {
                    ...base,
                    occupiedRooms: occupied,
                    idleRooms: idle,
                    sleepingRooms: sleeping,
                    activeDevices: allDevs.filter(d => d.status).length,
                    energyToday: base.energyToday + Math.random() * 5,
                };
            });
        }, 3000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [demoMode, queryClient]);
};

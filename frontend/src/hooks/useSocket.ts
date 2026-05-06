import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../utils/socket';
import { useAuthStore } from '../store/authStore';
import { useSystemStore } from '../store/systemStore';
import { useToast } from './useToast';
import type { Room, Device } from '../types';

const DEBOUNCE_MS = 300;

export const useSocketSync = () => {
    const queryClient = useQueryClient();
    const user = useAuthStore((s) => s.user);
    const setSocketConnected = useSystemStore((s) => s.setSocketConnected);
    const { warning } = useToast();

    // Debounce timers
    const dashboardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const analyticsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (!user) return;

        // ── Connection status ────────────────────────────────────────────────
        socket.on('connect', () => {
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            setSocketConnected(false);
            warning('Live connection lost — reconnecting…');
        });

        // ── room:updated → surgical cache update ─────────────────────────────
        socket.on('room:updated', (data: { roomId?: string; room?: Partial<Room> }) => {
            if (data.roomId && data.room) {
                // Patch only the specific room in the rooms list
                queryClient.setQueryData<Room[]>(['rooms'], (old) => {
                    if (!old) return old;
                    return old.map((r) =>
                        r._id === data.roomId ? { ...r, ...data.room } : r
                    );
                });
                // Patch the individual room cache
                queryClient.setQueryData<{ room: Room; devices: Device[] }>(
                    ['rooms', data.roomId],
                    (old) => {
                        if (!old) return old;
                        return { ...old, room: { ...old.room, ...data.room } };
                    }
                );
            } else {
                // Fallback: debounced full invalidate
                if (dashboardTimerRef.current) clearTimeout(dashboardTimerRef.current);
                dashboardTimerRef.current = setTimeout(() => {
                    queryClient.invalidateQueries({ queryKey: ['rooms'] });
                }, DEBOUNCE_MS);
            }

            // Debounce dashboard stats refresh
            if (dashboardTimerRef.current) clearTimeout(dashboardTimerRef.current);
            dashboardTimerRef.current = setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            }, DEBOUNCE_MS);
        });

        // ── device:updated → surgical device cache update ────────────────────
        socket.on('device:updated', (data: { roomId: string; deviceId: string; device?: Partial<Device> }) => {
            if (data.device) {
                // Patch device inside rooms list
                queryClient.setQueryData<Room[]>(['rooms'], (old) => {
                    if (!old) return old;
                    return old.map((room) => {
                        if (room._id !== data.roomId) return room;
                        return {
                            ...room,
                            devices: (room.devices ?? []).map((d) =>
                                d._id === data.deviceId ? { ...d, ...data.device } : d
                            ),
                        };
                    });
                });
                // Patch inside individual room cache
                queryClient.setQueryData<{ room: Room; devices: Device[] }>(
                    ['rooms', data.roomId],
                    (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            devices: old.devices.map((d) =>
                                d._id === data.deviceId ? { ...d, ...data.device } : d
                            ),
                        };
                    }
                );
            } else {
                // Fallback: debounced invalidate for just this room
                queryClient.invalidateQueries({ queryKey: ['rooms', data.roomId] });
            }
        });

        // ── energy:updated → debounced analytics refresh ────────────────────
        socket.on('energy:updated', () => {
            if (analyticsTimerRef.current) clearTimeout(analyticsTimerRef.current);
            analyticsTimerRef.current = setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ['analytics'] });
                queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            }, DEBOUNCE_MS);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('room:updated');
            socket.off('device:updated');
            socket.off('energy:updated');
            if (dashboardTimerRef.current) clearTimeout(dashboardTimerRef.current);
            if (analyticsTimerRef.current) clearTimeout(analyticsTimerRef.current);
        };
    }, [queryClient, user, setSocketConnected, warning]);
};

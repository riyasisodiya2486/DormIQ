import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from '../utils/socket';
import { useAuthStore } from '../store/authStore';

export const useSocketSync = () => {
    const queryClient = useQueryClient();
    const user = useAuthStore((s) => s.user);

    useEffect(() => {
        if (!user) return;

        socket.on('room:updated', (data: { roomId?: string; ownerId?: string }) => {
            console.log('Real-time: Room updated', data);
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            if (data.roomId) {
                queryClient.invalidateQueries({ queryKey: ['rooms', data.roomId] });
            }
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        });

        socket.on('device:updated', (data: { roomId: string; deviceId: string }) => {
            console.log('Real-time: Device updated', data);
            queryClient.invalidateQueries({ queryKey: ['rooms', data.roomId] });
        });

        socket.on('energy:updated', (data: { ownerId: string }) => {
            console.log('Real-time: Energy updated', data);
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        });

        return () => {
            socket.off('room:updated');
            socket.off('device:updated');
            socket.off('energy:updated');
        };
    }, [queryClient, user]);
};

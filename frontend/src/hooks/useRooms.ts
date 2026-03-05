import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { Room, RoomDetails } from '../types';

export const useRooms = () => {
    return useQuery<Room[]>({
        queryKey: ['rooms'],
        queryFn: async () => {
            const { data } = await api.get('/rooms');
            return data;
        }
    });
};

export const useRoomDetails = (roomId: string) => {
    return useQuery<RoomDetails>({
        queryKey: ['rooms', roomId],
        queryFn: async () => {
            const { data } = await api.get(`/rooms/${roomId}`);
            return data;
        },
        enabled: !!roomId
    });
};

export const useCreateRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (roomNumber: string) => {
            const { data } = await api.post('/rooms', { roomNumber });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });
};

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (roomId: string) => {
            await api.delete(`/rooms/${roomId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });
};

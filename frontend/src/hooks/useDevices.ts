import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { Device } from '../types';

export const useAddDevice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (deviceData: Partial<Device> & { roomNumber: string }) => {
            const { data } = await api.post('/devices', deviceData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });
};

export const useRemoveDevice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (deviceId: string) => {
            await api.delete(`/devices/${deviceId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
        }
    });
};

export const useUpdateDevice = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ deviceId, updates }: { deviceId: string, updates: Partial<Device> }) => {
            const { data } = await api.patch(`/devices/${deviceId}`, updates);
            return data;
        },
        onSuccess: (data: Device) => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] });
            queryClient.invalidateQueries({ queryKey: ['rooms', data.roomId] });
        }
    });
};

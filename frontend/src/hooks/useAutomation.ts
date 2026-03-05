import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { AutomationConfig } from '../types';

export const useAutomationConfig = () => {
    return useQuery<AutomationConfig>({
        queryKey: ['automation-config'],
        queryFn: async () => {
            const { data } = await api.get('/automation/config');
            return data;
        }
    });
};

export const useUpdateAutomationConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (updates: Partial<AutomationConfig>) => {
            const { data } = await api.patch('/automation/config', updates);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['automation-config'] });
        }
    });
};

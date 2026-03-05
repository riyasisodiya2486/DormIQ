import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { EnergyAnalytics, DashboardStats } from '../types';

export const useAnalytics = () => {
    return useQuery<EnergyAnalytics>({
        queryKey: ['analytics'],
        queryFn: async () => {
            const { data } = await api.get('/analytics/overview');
            return data;
        }
    });
};

export const useDashboardStats = () => {
    return useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const { data } = await api.get('/dashboard/stats');
            return data;
        }
    });
};

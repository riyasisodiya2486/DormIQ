import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { EnergyAnalytics, DashboardStats } from '../types';
import { mockAnalytics, mockDashboardStats, isAnalyticsEmpty } from '../data/mockData';
import { useToast } from './useToast';
import { useSystemStore } from '../store/systemStore';

export const useAnalytics = () => {
    const { error: showError } = useToast();
    const demoMode = useSystemStore((s) => s.demoMode);

    return useQuery<EnergyAnalytics>({
        queryKey: ['analytics'],
        queryFn: async () => {
            if (demoMode) return mockAnalytics;
            try {
                const { data } = await api.get('/analytics/overview');
                // Transparent fallback: if all arrays are empty, use mock
                if (isAnalyticsEmpty(data)) return mockAnalytics;
                return data;
            } catch (err) {
                showError('Failed to load analytics – showing demo data');
                return mockAnalytics;
            }
        },
        staleTime: 30_000,
        retry: 1,
    });
};

export const useDashboardStats = () => {
    const { error: showError } = useToast();
    const demoMode = useSystemStore((s) => s.demoMode);

    return useQuery<DashboardStats>({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            if (demoMode) return mockDashboardStats;
            try {
                const { data } = await api.get('/dashboard/stats');
                return data;
            } catch (err) {
                showError('Failed to load dashboard stats');
                return mockDashboardStats;
            }
        },
        staleTime: 15_000,
        retry: 1,
    });
};

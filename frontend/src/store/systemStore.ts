import { create } from 'zustand';

interface SystemState {
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;

    // Demo Mode
    demoMode: boolean;
    toggleDemoMode: () => void;

    // Socket
    socketConnected: boolean;
    setSocketConnected: (connected: boolean) => void;
}

export const useSystemStore = create<SystemState>((set) => ({
    sidebarCollapsed: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

    demoMode: false,
    toggleDemoMode: () => set((state) => ({ demoMode: !state.demoMode })),

    socketConnected: true,
    setSocketConnected: (connected) => set({ socketConnected: connected }),
}));

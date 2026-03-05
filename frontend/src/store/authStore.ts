import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    hostelName: string;
    email: string;
    totalRooms: number;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthenticated: boolean;
    setAuth: (token: string, user: User) => void;
    logout: () => void;
    hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
            logout: () => {
                set({ token: null, user: null, isAuthenticated: false });
                localStorage.removeItem('auth-storage');
            },
            hydrate: () => {
                const storage = localStorage.getItem('auth-storage');
                if (storage) {
                    try {
                        const { state } = JSON.parse(storage);
                        if (state.token) {
                            set({ ...state, isAuthenticated: true });
                        }
                    } catch (e) {
                        console.error('Failed to hydrate auth store', e);
                    }
                }
            }
        }),
        {
            name: 'auth-storage'
        }
    )
);

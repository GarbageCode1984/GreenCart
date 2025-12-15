import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
    isAuth: boolean;
    userData: {
        _id: string;
        name: string;
        email: string;
        role: string;
        wishlist: string[];
    } | null;
}

interface AuthActions {
    login: (user: AuthState["userData"]) => void;
    logout: () => void;
    setUser: (user: AuthState["userData"]) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
    persist<AuthStore>(
        (set) => ({
            isAuth: false,
            userData: null,

            login: (user) =>
                set({
                    isAuth: true,
                    userData: user,
                }),

            logout: () =>
                set({
                    isAuth: false,
                    userData: null,
                }),

            setUser: (user) => set((state) => ({ ...state, userData: user, isAuth: !!user })),
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

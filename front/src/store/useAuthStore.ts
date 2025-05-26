import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
    isAuth: boolean;
    userData: {
        _id: string;
        name: string;
        email: string;
        role: string;
    } | null;
}

interface AuthActions {
    login: (user: AuthState["userData"]) => void;
    logout: () => void;
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
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

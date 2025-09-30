import { createContext, useContext, useEffect, useState } from "react";

import type { ReactNode } from "react";
import type {
    UserContextType,
} from "@/types/types";

type UserProviderProps = { children: ReactNode };
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
    children,
}: UserProviderProps) => {
    const [userId, setUserId] = useState<string>(() => localStorage.getItem("userId") || "");
    const [userToken, setUserToken] = useState<string>(() => localStorage.getItem("userToken") || "");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean|null>(null);

    useEffect(() => {
        setIsLoggedIn(isTokenValid(getFromLocalStorage()));
    }, [userToken]);

    const saveToLocalStorage = (userId: string, token: string) => {
        localStorage.setItem("userId", userId);
        localStorage.setItem("userToken", token);
        const time = new Date().getTime();
        localStorage.setItem("tokenTimestamp", time.toString());
    }

    const getFromLocalStorage = () => {
        const userId = localStorage.getItem("userId") || "";
        const token = localStorage.getItem("userToken") || "";
        const timestamp = localStorage.getItem("tokenTimestamp") || "0";
        return { userId, token, timestamp };
    }

    const isTokenValid = ({ userId, token, timestamp }: { userId: string; token: string; timestamp: string }) => {
        if (!userId || !token || !timestamp) return false;
        const now = Date.now();
        const tokenTime = Number(timestamp);
        // 1 hour = 3600000 ms
        return now - tokenTime < 3600000;
    }

    return (
        <UserContext.Provider
            value={{
                userId,
                setUserId,
                userToken,
                setUserToken,
                saveToLocalStorage,
                isLoggedIn,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

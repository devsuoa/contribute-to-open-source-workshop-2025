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
    const [userId, setUserId] = useState<string>("");
    const [userToken, setUserToken] = useState<string>(() => localStorage.getItem("userToken") || "");
    const [isLoggedIn, setIsLoggedIn] = useState<boolean|null>(null);

    useEffect(() => {
        setIsLoggedIn(isTokenValid(getTokenFromLocalStorage()));
    }, [userToken]);

    const setTokenToLocalStorage = (token: string) => {
        localStorage.setItem("userToken", token);
    }

    const getTokenFromLocalStorage = () => {
        return localStorage.getItem("userToken") || "";
    }

    const isTokenValid = (token: string) => {
        return !!token; // Placeholder: consider any non-empty token as valid
    }

    return (
        <UserContext.Provider
            value={{
                userId,
                setUserId,
                userToken,
                setUserToken,
                setTokenToLocalStorage,
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

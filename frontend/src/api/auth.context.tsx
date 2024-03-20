import { useContext, createContext, PropsWithChildren, useState, useEffect } from "react";
import { authGetAccessToken, authGetCurrentUser } from "./auth.http";
import { UserInfo } from "./types";

interface AuthContextValue {
    user: UserInfo | null,
    token: string | null,
    isAuthenticated: boolean,
    authenticate: (username: string, password: string) => Promise<void>,
    logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    token: null,
    isAuthenticated: false,
    authenticate: async (a: string, b: string) => {},
    logout: () => {}
});

export default function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const isAuthenticated = user !== null;

    const authenticate = async(username: string, password: string) => {
        const accessToken = await authGetAccessToken(username, password);

        if(accessToken === null){
            throw Error("wrong credentials were given");
        }

        const currentUser = await authGetCurrentUser(accessToken);

        setUser(currentUser);
        setToken(accessToken);
        localStorage.setItem("token", accessToken);
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
    }

    useEffect(() => {
        const accessToken = localStorage.getItem("token");
        if(accessToken === null){
            return
        }

        authGetCurrentUser(accessToken).then((user) => {
            setUser(user);
            setToken(accessToken);
        }).catch(e => {
            localStorage.removeItem("token");
        });
    }, []);

    return <AuthContext.Provider 
        value={{ user, token, isAuthenticated, authenticate, logout }}>{ children }</AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext);
}

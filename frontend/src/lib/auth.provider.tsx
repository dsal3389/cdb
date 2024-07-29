import { useContext, createContext, PropsWithChildren, useState, useEffect } from "react";
import { authenticationToken, authGetCurrentUser } from "./api/auth";
import { CurrentUser } from "./types";

interface AuthContextValue {
  user: CurrentUser | null,
  token: string | null,
  isAuthenticated: boolean,
  authenticate: (username: string, password: string) => Promise<void>,
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  isAuthenticated: false,
  authenticate: async (_a: string, _b: string) => { },
  logout: () => { }
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const isAuthenticated = user !== null;

  const authenticate = async (username: string, password: string) => {
    const token = await authenticationToken(username, password);
    const currentUser = await authGetCurrentUser(token.access_token);

    setUser(currentUser);
    setToken(token.access_token);
    localStorage.setItem("token", token.access_token);
  }

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken === null) {
      return
    }

    authGetCurrentUser(accessToken).then((user) => {
      setUser(user);
      setToken(accessToken);
    }).catch(_ => {
      localStorage.removeItem("token");
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

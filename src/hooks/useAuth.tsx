import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { loginApi } from "@/components/Service/authApi";
import api from "@/lib/axios";

interface AuthContextType {
  auth: AuthState | null;
  loading: boolean;
  signIn: (login_id: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
}

interface AuthUser {
  user_id: number;
  username?: string;
  email?: string;
}

interface AuthState {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Restore auth on refresh
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
    setLoading(false);
  }, []);

  
  const signIn = async (login_id: string, password: string) => {
    try {
      setLoading(true);
      const data = await loginApi({ login_id, password });
      console.log("data",data);

      const authData: AuthState = {
        accessToken: data.token.access,
        refreshToken: data.token.refresh,
        user: data.user,
      };
      //  console.log("authData",authData)
      localStorage.setItem("auth", JSON.stringify(authData));
      setAuth(authData);

      setLoading(false);
      return { error: null };
    } catch (error: any) {
      setLoading(false);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Login failed";

      return { error: new Error(message) };
    }
  };

//     export const refreshToken = async (refreshToken: string) => {
//    const { data } = await api.post("/refresh-token/", { refresh_token: refreshToken });
//    return data; // should return { access: string, refresh: string }
// };

  // ✅ LOGOUT
  const signOut = () => {
    localStorage.removeItem("auth");
    setAuth(null);
    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider value={{ auth, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

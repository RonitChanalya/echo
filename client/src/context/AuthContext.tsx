import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "../services/api";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const response = await api("/auth/me");

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = await response.json();

      setUser({
        id: data.user._id,
        name: data.user.name,
        username: data.user.username,
        email: data.user.email,
        avatar: data.user.avatar,
        bio: data.user.bio,
      });
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    setUser(data.user);
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    password: string
  ) => {
    const response = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        username,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
  };

  const logout = async () => {
    await api("/auth/logout", {
      method: "POST",
    });

    setUser(null);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type User = {
  id: number;
  name: string;
  username?: string | null;
  ntlogin?: string | null;
  role: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const roleToPath = (role: number) => {
  // switch (role) {
  //   case '9': return '/admin';
  //   case 'hr': return '/hr';
  //   case 'it': return '/it';
  //   case 'team_leader': return '/team-leader';
  //   case 'engineering_auxiliary': return '/engineering';
  //   case 'admin_facilities': return '/facilities';
  //   case 'account_coordinator': return '/account';
  //   case 'operations_manager': return '/operations';
  //   case 'employee': return '/employee';
  //   default: return '/';
  // }
  switch (role) {
    case 1: return '/admin';
    case 9: return '/hr';
    case 2: return '/it';
    case 3: return '/team-leader';
    case 4: return '/engineering';
    case 5: return '/facilities';
    case 6: return '/account';
    case 7: return '/operations';
    case 8: return '/employee';
    default: return '/';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch current user on mount
  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async (): Promise<User | null> => {
    try {
      const res = await fetch(`http://localhost:8000/api/user`, {
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });

      if (!res.ok) {
        setUser(null);
        return null;
      }

      const data = await res.json();
      setUser(data);

      // Auto-redirect if user is at "/" or "/login"
      if (location.pathname === '/' || location.pathname === '/login') {
        const path = roleToPath(data.role);
        navigate(path, { replace: true });
      }

      return data;
    } catch (err) {
      setUser(null);
      return null;
    }
  };

  const login = async (identifier: string, password: string): Promise<User> => {
    // 1. get CSRF cookie
    await fetch(`${API_URL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    });

    // 2. login request
    const res = await fetch(`http://localhost:8000/api/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(err.message || 'Login failed');
    }

    const json = await res.json();
    const loggedUser: User = json.user;
    console.log(json.user);
    setUser(loggedUser);

    // Redirect to role dashboard
    const path = roleToPath(loggedUser.role);
    navigate(path, { replace: true });

    return loggedUser;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      navigate('/', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

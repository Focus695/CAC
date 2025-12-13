"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  email: string;
  username?: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

// Create the context with a default value
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const refreshProfile = async () => {
    try {
      // Restore login state via backend cookie session
      const profile = await apiService.getProfile();
      // Backend JwtStrategy returns { userId, email, role }, so we need a compatibility mapping here
      if (profile && typeof profile === 'object') {
        setUser({
          id: (profile.userId || profile.id) as string,
          email: profile.email,
          role: profile.role,
          username: profile.username,
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  // Initialize: attempt to restore session from cookie
  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await apiService.logout();
    } catch {
      // 即便后端退出失败，也清理本地状态，避免卡死在“伪登录”
    } finally {
      setUser(null);
    }
  };

  // Create context value
  const contextValue: UserContextType = {
    user,
    setUser,
    isAuthenticated,
    refreshProfile,
    logout,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

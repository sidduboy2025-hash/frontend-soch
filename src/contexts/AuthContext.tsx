import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, User } from '@/api/api-methods';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateAuthState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const updateAuthState = () => {
    const authStatus = authAPI.isAuthenticated();
    const user = authAPI.getCurrentUser();
    
    setIsAuthenticated(authStatus);
    setCurrentUser(user);
  };

  const login = (user: User, token: string) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };

  const logout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  useEffect(() => {
    updateAuthState();
  }, []);

  const value: AuthContextType = {
    isAuthenticated,
    currentUser,
    login,
    logout,
    updateAuthState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
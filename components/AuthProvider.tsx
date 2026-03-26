'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type MockUser = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: MockUser | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // For testing: Always provide a mock user as initial state
  const [user, setUser] = useState<MockUser | null>({ id: 'test-user-id', email: 'test@example.com' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /* Original logic commented out for testing
    const storedUser = localStorage.getItem('mock_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setTimeout(() => {
          setUser(parsed);
          setLoading(false);
        }, 0);
      } catch (e) {
        console.error("Failed to parse stored user", e);
        setTimeout(() => setLoading(false), 0);
      }
    } else {
      setTimeout(() => setLoading(false), 0);
    }
    */
  }, []);

  const login = (email: string) => {
    const mockUser = { id: 'mock-id-123', email };
    setUser(mockUser);
    localStorage.setItem('mock_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

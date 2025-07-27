import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../lib/api';
import { getStoredUser, storeUser, removeUser } from '../lib/auth';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, userData) => {
    try {
      const response = await authAPI.signup({
        email,
        password,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
      });
      
      storeUser(response.user, response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authAPI.signin({ email, password });
      
      storeUser(response.user, response.token);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
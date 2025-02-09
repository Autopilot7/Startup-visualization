// src/context/AuthContext.tsx
'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  accessToken: null,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

interface DecodedToken {
  exp: number; // Expiration time as a UNIX timestamp
  [key: string]: any;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to check token expiration and set a timeout for automatic logout
  const scheduleTokenExpiration = (token: string) => {
    const decoded: DecodedToken = jwtDecode(token);
    const expiresAt = decoded.exp * 1000; // Convert to milliseconds
    const timeout = expiresAt - Date.now();

    if (timeout > 0) {
      setTimeout(() => {
        toast.error('Session expired. Please log in again.');
        logout();
      }, timeout);
    } else {
      // Token already expired
      toast.error('Session expired. Please log in again.');
      logout();
    }
  };

  // Function to handle login
  const login = (token: string) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
    scheduleTokenExpiration(token);
  };

  // Function to handle logout
  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    toast.success('Logged out successfully!');
    router.push('/login');
  };

  // Initialize authentication state from localStorage
  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          setAccessToken(token);
          scheduleTokenExpiration(token);
        }
      } catch (error) {
        console.error('Error fetching access token:', error);
        setAccessToken(null);
        localStorage.removeItem('accessToken');
        toast.error('Authentication failed. Please log in again.');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  // Axios interceptor to add Authorization header and handle 401 responses
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          toast.error('Session expired. Please log in again.');
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  const isAuthenticated = !!accessToken;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

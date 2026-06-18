import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('sc_token') || null);
  const [loading, setLoading] = useState(true);

  // ── Restore session from localStorage on mount ──
  useEffect(() => {
    const storedToken = localStorage.getItem('sc_token');
    const storedUser = localStorage.getItem('sc_user');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch {
        // Corrupt storage — wipe it
        localStorage.removeItem('sc_token');
        localStorage.removeItem('sc_user');
      }
    }
    setLoading(false);
  }, []);

  // ── Complete logout ──
  const logout = useCallback(() => {
    // 1. Wipe ALL localStorage (no stale keys left behind)
    localStorage.clear();

    // 2. Wipe ALL sessionStorage
    sessionStorage.clear();

    // 3. Remove Authorization header from axios
    delete axios.defaults.headers.common['Authorization'];

    // 4. Clear React state
    setToken(null);
    setUser(null);

    // 5. Force a hard redirect to the home page (bypasses router issues and clears memory)
    setTimeout(() => {
      window.location.replace('/');
    }, 10);
  }, []);

  // ── Login ──
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token: receivedToken, user: loggedUser } = response.data;

      localStorage.setItem('sc_token', receivedToken);
      localStorage.setItem('sc_user', JSON.stringify(loggedUser));

      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

      setToken(receivedToken);
      setUser(loggedUser);
      setLoading(false);
      return loggedUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // ── Register ──
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // ── Update profile ──
  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/patients/${user.id}`, profileData);
      const updatedUser = response.data;
      localStorage.setItem('sc_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  // ── Inactivity auto-logout (15 min) ──
  useEffect(() => {
    if (!token) return;
    const TIMEOUT = 15 * 60 * 1000;
    let timer;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => logout(), TIMEOUT);
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'click', 'scroll'];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [token, logout]);

  const val = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return React.createElement(AuthContext.Provider, { value: val }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

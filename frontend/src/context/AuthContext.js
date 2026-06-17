import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sc_token') || null);
  const [loading, setLoading] = useState(true);

  // Inactivity logout setup
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  let inactivityTimer;

  const resetTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      // Auto logout on inactivity
      logout();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    // Setup activity listeners
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'click'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    // Start timer initially
    resetTimer();
    return () => {
      // Cleanup listeners and timer
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (inactivityTimer) clearTimeout(inactivityTimer);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token: receivedToken, user: loggedUser } = response.data;
      
      localStorage.setItem('sc_token', receivedToken);
      localStorage.setItem('sc_user', JSON.stringify(loggedUser));
      
      setToken(receivedToken);
      setUser(loggedUser);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;
      setLoading(false);
      return loggedUser;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

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

  const logout = () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

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

  const val = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateProfile
  };

  return React.createElement(AuthContext.Provider, { value: val }, children);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

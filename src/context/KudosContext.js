import React, { createContext, useState, useContext } from 'react';
import * as api from '../services/api';

// Create the context
const KudosContext = createContext(null);

// Create the provider component
const KudosProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [receivedKudos, setReceivedKudos] = useState([]);
  const [givenKudos, setGivenKudos] = useState([]);
  const [availableKudos, setAvailableKudos] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login handler
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const user = await api.loginUser(username, password);
      setCurrentUser(user);
      // Clear any existing users data when logging in
      setUsers([]);
      await loadUserData(user.id);
      return user;
    } catch (err) {
      setError(err.message || 'Login failed');
      setCurrentUser(null);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    setLoading(false);
    setError(null);
    setCurrentUser(null);
    setUsers([]);
    setReceivedKudos([]);
    setGivenKudos([]);
    setAvailableKudos(null);
  };

  // Load user data after login
  const loadUserData = async (userId) => {
    if (!userId) return; // Don't load data if no userId
    
    try {
      setLoading(true);
      const [available, received, given] = await Promise.all([
        api.fetchAvailableKudos(userId),
        api.fetchReceivedKudos(userId),
        api.fetchGivenKudos(userId),
      ]);

      // Check if user is still logged in before setting state
      if (currentUser?.id === userId) {
        setAvailableKudos(available.kudos_left);
        setReceivedKudos(received);
        setGivenKudos(given);
        setError(null);
      }
    } catch (err) {
      // Only set error if user is still logged in
      if (currentUser?.id === userId) {
        setError('Failed to load user data');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Give kudo
  const giveKudo = async (toUserId, message) => {
    if (!currentUser) throw new Error('No user logged in');
    
    setLoading(true);
    try {
      await api.giveKudo(currentUser.id, toUserId, message);
      await loadUserData(currentUser.id); // Refresh data after giving kudo
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load users for give kudos tab
  const loadUsers = async () => {
    console.log('[KudosContext] loadUsers called at:', new Date().toISOString(), 
                'currentUser:', !!currentUser,
                'loading:', loading,
                'users.length:', users.length);

    if (!currentUser) {
      return;
    }
    
    if (loading) {
      return;
    }
    
    if (users.length > 0) {
      return;
    }

    const loadId = Date.now();
    console.log('[KudosContext] Starting load:', loadId);
    
    try {
      setLoading(true);
      const usersList = await api.fetchUsers(currentUser.id);
      if (usersList) {
        console.log('[KudosContext] Load complete:', loadId, 'users:', usersList.length);
        setUsers(usersList);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    users,
    receivedKudos,
    givenKudos,
    availableKudos,
    loading,
    error,
    login,
    logout,
    giveKudo,
    loadUsers,
  };

  return <KudosContext.Provider value={value}>{children}</KudosContext.Provider>;
};

// Hook for using the kudos context
const useKudos = () => {
  const context = useContext(KudosContext);
  if (!context) {
    throw new Error('useKudos must be used within a KudosProvider');
  }
  return context;
};

// Export the provider and hook
export { KudosProvider, useKudos };
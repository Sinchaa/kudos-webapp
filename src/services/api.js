const API_BASE_URL = 'http://localhost:8000';

// Auth API
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  
  return response.json();
};

// Kudos API
export const fetchUsers = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/kudos/fetch-users?user_id=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
};

export const fetchReceivedKudos = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/kudos/received-kudos?user_id=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch received kudos');
  }
  return response.json();
};

export const fetchAvailableKudos = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/kudos/available-kudos?user_id=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch available kudos');
  }
  return response.json();
};

export const fetchGivenKudos = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/kudos/given-kudos?user_id=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch given kudos');
  }
  return response.json();
};

export const giveKudo = async (fromUserId, toUserId, message) => {
  const response = await fetch(`${API_BASE_URL}/kudos/give-kudos?user_id=${fromUserId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      kudos_to_id: toUserId,
      message,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to give kudo');
  }
  
  return response.json();
};
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import Dashboard from './Dashboard';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [receivedKudos, setReceivedKudos] = useState([]);
  const [givenKudos, setGivenKudos] = useState([]);
  const [activeTab, setActiveTab] = useState('received'); // 'received', 'give', 'given'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [kudoMessage, setKudoMessage] = useState('');
  const [giveKudoError, setGiveKudoError] = useState('');
  const [giveKudoSuccess, setGiveKudoSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableKudos, setAvailableKudos] = useState(null);

  const getInitials = (firstName, lastName, username) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return username?.substring(0, 2).toUpperCase();
  };

  // Fetch organization users
  const fetchUsers = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/kudos/fetch-users?user_id=${userId}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch received kudos
  const fetchReceivedKudos = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/kudos/received-kudos?user_id=${userId}`);
      const data = await response.json();
      setReceivedKudos(data);
    } catch (error) {
      console.error('Error fetching kudos:', error);
    }
  };

    // Fetch received kudos
  const fetchAvailableKudos = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/kudos/available-kudos?user_id=${userId}`);
      const data = await response.json();
      setAvailableKudos(data.kudos_left);
    } catch (error) {
      console.error('Error fetching kudos:', error);
    }
  };

  const fetchGivenKudos = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/kudos/given-kudos?user_id=${userId}`);
      const data = await response.json();
      setGivenKudos(data);
    } catch (error) {
      console.error('Error fetching given kudos:', error);
    }
  };

  // When currentUser is set, load initial user-specific data
  useEffect(() => {
    if (currentUser) {
      fetchAvailableKudos(currentUser.id);
      setSelectedUserId(currentUser.id);
      fetchReceivedKudos(currentUser.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

    const handleOpenGiveKudos = (userId) => {
    setSelectedUserId(userId);
    setKudoMessage('');
    setGiveKudoError('');
    setGiveKudoSuccess('');
  };

  // Close give kudos form
  const handleCloseGiveKudos = () => {
    setSelectedUserId(null);
    setKudoMessage('');
    setGiveKudoError('');
  };

  // Give kudo handler
  const handleGiveKudo = async (e) => {
    e.preventDefault();
    setGiveKudoError('');
    setGiveKudoSuccess('');

    if (!selectedUserId || !kudoMessage.trim()) {
      setGiveKudoError('Please select a user and enter a message');
      return;
    }

    setLoading(true);

    try {
    const response = await fetch(`${API_BASE_URL}/kudos/give-kudos?user_id=${currentUser.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kudos_to_id: parseInt(selectedUserId), // Change to kudos_to_id
        message: kudoMessage,
      }),
    });


      const data = await response.json();

      if (response.ok) {
        setGiveKudoSuccess('Kudo sent successfully!');
        setSelectedUserId(null);
        setKudoMessage('');
        // Optionally refresh received kudos if giving to yourself somehow
        fetchReceivedKudos(currentUser.id);
        fetchAvailableKudos(currentUser.id);
        handleTabChange('given')
        // Clear success message after 2 seconds
        setTimeout(() => {
          setGiveKudoSuccess('');
        }, 2000);
        
      } else {
        setGiveKudoError(data.error || 'Failed to give kudo');
      }
    } catch (error) {
      setGiveKudoError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    setCurrentUser(null);
    setUsers([]);
    setReceivedKudos([]);
    setGivenKudos([]);
    setSelectedUserId(null);
    setKudoMessage('');
    setActiveTab('received');
    setAvailableKudos(null);
    navigate('/login');
  };

    const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Fetch data based on which tab is selected
    if (tab === 'give') { // && users.length === 0
      fetchUsers(currentUser.id);
    } else if (tab === 'given') { //&& givenKudos.length === 0
      fetchGivenKudos(currentUser.id);
    }
    // 'received' tab data is already loaded on login
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  

  // Routes declaration
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={(user) => setCurrentUser(user)} />} />
      <Route
        path="/dashboard"
        element={
          <Dashboard
            currentUser={currentUser}
            availableKudos={availableKudos}
            handleLogout={handleLogout}
            getInitials={getInitials}
            handleTabChange={handleTabChange}
            activeTab={activeTab}
            receivedKudos={receivedKudos}
            formatDate={formatDate}
            users={users}
            handleOpenGiveKudos={handleOpenGiveKudos}
            selectedUserId={selectedUserId}
            handleCloseGiveKudos={handleCloseGiveKudos}
            handleGiveKudo={handleGiveKudo}
            kudoMessage={kudoMessage}
            setKudoMessage={setKudoMessage}
            giveKudoError={giveKudoError}
            loading={loading}
            giveKudoSuccess={giveKudoSuccess}
            givenKudos={givenKudos}
          />
        }
      />
      <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
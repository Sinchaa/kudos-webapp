import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './Login';

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

  // We'll use routes for login and dashboard views. Define simple route-guarded view components.
  // We'll use a separate Login component to keep input state local and fast

  const DashboardView = () => {
    if (!currentUser) return <Navigate to="/login" replace />;
    return (
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>Kudos App</h1>
            <div className="user-info">
              <div className="kudos-badge">
                <span className="kudos-count">{availableKudos}</span>
                <span className="kudos-label">kudos left</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="main-content">
          <div className="dashboard-layout">
            {/* Left Sidebar - Profile */}
            <aside className="profile-sidebar">
              <div className="profile-card">
                <div className="profile-avatar">
                  {getInitials(currentUser.first_name, currentUser.last_name, currentUser.username)}
                </div>
                <h2 className="profile-name">
                  {currentUser.first_name} {currentUser.last_name}
                </h2>
                <p className="profile-username">@{currentUser.username}</p>
                <p className="profile-email">{currentUser.username}@{currentUser.organization}.com</p>
                <div className="profile-org">
                  <span className="org-label">Organization</span>
                  <span className="org-name">{currentUser.organization}</span>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="content-area">
              {/* Tabs */}
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'received' ? 'active' : ''}`}
                  onClick={() => handleTabChange('received')}
                >
                  My Kudos
                  <span className="tab-badge">{receivedKudos.length}</span>
                </button>
                {/* Always show Give Kudos tab. If user has no kudos left, mark visually and show message inside tab content */}
                <button
                  className={`tab ${activeTab === 'give' ? 'active' : ''} ${availableKudos === 0 ? 'tab-disabled' : ''}`}
                  onClick={() => handleTabChange('give')}
                  aria-disabled={availableKudos === 0}
                  tabIndex={0}
                >
                  Give Kudos
                </button>
                <button
                  className={`tab ${activeTab === 'given' ? 'active' : ''}`}
                  onClick={() => handleTabChange('given')}
                >
                  Kudos Given
                  <span className="tab-badge">{givenKudos.length}</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {/* My Kudos Tab */}
                {activeTab === 'received' && (
                  <div className="kudos-list">
                    {receivedKudos.length === 0 ? (
                      <div className="empty-state">
                        <p>No kudos received yet.</p>
                        <p>Keep up the great work!</p>
                      </div>
                    ) : (
                      receivedKudos.map((kudo) => (
                        <div key={kudo.id} className="kudo-item">
                          <div className="kudo-avatar">
                            {getInitials(kudo.kudos_from.split(' ')[0], kudo.kudos_from.split(' ')[1], kudo.kudos_from)}
                          </div>
                          <div className="kudo-content">
                            <div className="kudo-header">
                              <span className="kudo-from">
                                <strong>{kudo.kudos_from}</strong>
                              </span>
                              <span className="kudo-date">{formatDate(kudo.created_at)}</span>
                            </div>
                            <p className="kudo-message">{kudo.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Give Kudos Tab */}
                {activeTab === 'give' && (
                  <div className="users-list">


                    {/* Show a clear message inside the Give tab when user has no kudos left */}
                    {availableKudos === 0 && (
                      <div className="info-message">
                        You have no kudos left this week. You won't be able to send kudos until they reset.
                      </div>
                    )}

                    {currentUser.kudos_remaining === 0 && (
                      <div className="info-message">
                        You've used all your kudos this week. They'll reset on Monday!
                      </div>
                    )}

                    {users.map((user) => (
                      <div key={user.id} className="user-card">
                        <div className="user-avatar">
                          {getInitials(user.first_name, user.last_name, user.username)}
                        </div>
                        <div className="user-details">
                          <h3 className="user-name">
                            {user.first_name} {user.last_name}
                          </h3>
                          <p className="user-username">@{user.username}</p>
                          <p className="user-email">{user.username}@company.com</p>
                        </div>
                        <button
                          className="btn-give-kudo"
                          onClick={() => handleOpenGiveKudos(user.id)}
                          disabled={availableKudos === 0 || selectedUserId === user.id}
                          // show tooltip via title on parent span for disabled state in some browsers
                        >
                          { (currentUser.kudos_remaining === 0 || selectedUserId === user.id) ? (
                            <span
                              title={
                                currentUser.kudos_remaining === 0
                                  ? "You've used all your kudos this week"
                                  : 'Kudo form already open'
                              }
                              style={{ display: 'inline-block' }}
                            >
                              +
                            </span>
                          ) : (
                            '+'
                          )}
                        </button>

                        {/* Kudo Message Form */}
                        {selectedUserId === user.id && (
                          <div className="kudo-form-overlay">
                            <div className="kudo-form-card">
                              <div className="kudo-form-header">
                                <h3>Give Kudo to {user.first_name}</h3>
                                <button className="btn-close" onClick={handleCloseGiveKudos}>
                                  ×
                                </button>
                              </div>
                              <form onSubmit={handleGiveKudo}>
                                <textarea
                                  value={kudoMessage}
                                  onChange={(e) => setKudoMessage(e.target.value)}
                                  placeholder="Write why you're giving this kudo..."
                                  rows="4"
                                  required
                                  autoFocus
                                />
                                {giveKudoError && (
                                  <div className="error-message">{giveKudoError}</div>
                                )}
                                <div className="kudo-form-actions">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseGiveKudos}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                  >
                                    {loading ? 'Sending...' : 'Send Kudo 🎉'}
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Kudos Given Tab */}
                {activeTab === 'given' && (
                  <div className="kudos-list">
                    {giveKudoSuccess && (
                      <div className="success-message-floating">{giveKudoSuccess}</div>
                    )}
                    {givenKudos.length === 0 ? (
                      <div className="empty-state">
                        <p>You haven't given any kudos yet.</p>
                        <p>Start spreading positivity!</p>
                      </div>
                    ) : (
                      givenKudos.map((kudo) => (
                        <div key={kudo.id} className="kudo-item">
                          <div className="kudo-avatar">
                            {getInitials(kudo.kudos_to.split(' ')[0], kudo.kudos_to.split(' ')[1], kudo.kudos_to)}
                          </div>
                          <div className="kudo-content">
                            <div className="kudo-header">
                              <span className="kudo-from">
                                To: <strong>{kudo.kudos_to}</strong>
                              </span>
                              <span className="kudo-date">{formatDate(kudo.created_at)}</span>
                            </div>
                            <p className="kudo-message">{kudo.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  };

  // Routes declaration
  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={(user) => setCurrentUser(user)} />} />
      <Route path="/dashboard" element={<DashboardView />} />
      <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
import { Navigate } from 'react-router-dom';

export default function Dashboard(props) {
  const {
    currentUser,
    availableKudos,
    handleLogout,
    getInitials,
    handleTabChange,
    activeTab,
    receivedKudos,
    formatDate,
    users,
    handleOpenGiveKudos,
    selectedUserId,
    handleCloseGiveKudos,
    handleGiveKudo,
    kudoMessage,
    setKudoMessage,
    giveKudoError,
    loading,
    giveKudoSuccess,
    givenKudos,
  } = props;

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
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useKudos } from '../../context/KudosContext';

export const Header = () => {
  const { currentUser, availableKudos, logout } = useKudos();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <h1>Kudos App</h1>
        {currentUser && (
          <div className="user-info">
            <div className="kudos-badge">
              <span className="kudos-count">{availableKudos}</span>
              <span className="kudos-label">kudos left</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
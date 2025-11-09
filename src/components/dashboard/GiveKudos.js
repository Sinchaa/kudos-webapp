import React, { useState, useEffect } from 'react';
import { useKudos } from '../../context/KudosContext';
import { Avatar } from '../shared/Avatar';
import { KudoForm } from './KudoForm';

export const GiveKudos = () => {
  const { users, availableKudos, loadUsers, currentUser } = useKudos();
  const [selectedUser, setSelectedUser] = useState(null);
  const initialized = React.useRef(false);

  useEffect(() => {
    console.log('[GiveKudos] useEffect triggered:', new Date().toISOString(),
                'initialized:', initialized.current,
                'currentUser:', !!currentUser);

    if (!initialized.current && currentUser) {
      console.log('[GiveKudos] Starting initialization');
      initialized.current = true;
      loadUsers();
    }
  }, [currentUser, loadUsers]);

  if (availableKudos === 0) {
    return (
      <div className="info-message">
        You have no kudos left this week. You won't be able to send kudos until they reset.
      </div>
    );
  }

  return (
    <div className="users-list">
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <Avatar
            firstName={user.first_name}
            lastName={user.last_name}
            username={user.username}
          />
          <div className="user-details">
            <h3 className="user-name">
              {user.first_name} {user.last_name}
            </h3>
            <p className="user-username">@{user.username}</p>
            <p className="user-email">{user.username}@company.com</p>
          </div>
          <button
            className="btn-give-kudo"
            onClick={() => setSelectedUser(user)}
            disabled={availableKudos === 0}
          >
            +
          </button>
          {selectedUser?.id === user.id && (
            <KudoForm
              user={user}
              onClose={() => setSelectedUser(null)}
            />
          )}
        </div>
      ))}
    </div>
  );
};
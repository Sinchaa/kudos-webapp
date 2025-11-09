import React from 'react';
import { Avatar } from '../shared/Avatar';
import { useKudos } from '../../context/KudosContext';

export const UserProfile = () => {
  const { currentUser } = useKudos();

  if (!currentUser) return null;

  return (
    <aside className="profile-sidebar">
      <div className="profile-card">
        <Avatar
          firstName={currentUser.first_name}
          lastName={currentUser.last_name}
          username={currentUser.username}
        />
        <h2 className="profile-name">
          {currentUser.first_name} {currentUser.last_name}
        </h2>
        <p className="profile-username">@{currentUser.username}</p>
        <p className="profile-email">
          {currentUser.username}@{currentUser.organization}.com
        </p>
        <div className="profile-org">
          <span className="org-label">Organization</span>
          <span className="org-name">{currentUser.organization}</span>
        </div>
      </div>
    </aside>
  );
};
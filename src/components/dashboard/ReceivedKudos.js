import React from 'react';
import { useKudos } from '../../context/KudosContext';
import { Avatar } from '../shared/Avatar';
import { formatDate } from '../../utils/helpers';

export const ReceivedKudos = () => {
  const { receivedKudos } = useKudos();

  if (receivedKudos.length === 0) {
    return (
      <div className="empty-state">
        <p>No kudos received yet.</p>
        <p>Keep up the great work!</p>
      </div>
    );
  }

  return (
    <div className="kudos-list">
      {receivedKudos.map((kudo) => (
        <div key={kudo.id} className="kudo-item">
          <Avatar
            firstName={kudo.kudos_from.split(' ')[0]}
            lastName={kudo.kudos_from.split(' ')[1]}
            username={kudo.kudos_from}
          />
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
      ))}
    </div>
  );
};
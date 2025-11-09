import React from 'react';
import { useKudos } from '../../context/KudosContext';
import { Avatar } from '../shared/Avatar';
import { formatDate } from '../../utils/helpers';

export const GivenKudos = () => {
  const { givenKudos } = useKudos();

  if (givenKudos.length === 0) {
    return (
      <div className="empty-state">
        <p>You haven't given any kudos yet.</p>
        <p>Start spreading positivity!</p>
      </div>
    );
  }

  return (
    <div className="kudos-list">
      {givenKudos.map((kudo) => (
        <div key={kudo.id} className="kudo-item">
          <Avatar
            firstName={kudo.kudos_to.split(' ')[0]}
            lastName={kudo.kudos_to.split(' ')[1]}
            username={kudo.kudos_to}
          />
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
      ))}
    </div>
  );
};
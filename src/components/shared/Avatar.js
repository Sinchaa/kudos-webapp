import React from 'react';
import { getInitials } from '../../utils/helpers';

export const Avatar = ({ firstName, lastName, username }) => (
  <div className="user-avatar">
    {getInitials(firstName, lastName, username)}
  </div>
);
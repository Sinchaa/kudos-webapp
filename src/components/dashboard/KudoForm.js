import React, { useState } from 'react';
import { useKudos } from '../../context/KudosContext';

export const KudoForm = ({ user, onClose }) => {
  const [message, setMessage] = useState('');
  const { giveKudo, loading, error } = useKudos();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await giveKudo(user.id, message);
      setMessage('');
      onClose();
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <div className="kudo-form-overlay">
      <div className="kudo-form-card">
        <div className="kudo-form-header">
          <h3>Give Kudo to {user.first_name}</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write why you're giving this kudo..."
            rows="4"
            required
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
          <div className="kudo-form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
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
  );
};
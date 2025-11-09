import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from './UserProfile';
import { ReceivedKudos } from './ReceivedKudos';
import { GiveKudos } from './GiveKudos';
import { GivenKudos } from './GivenKudos';
import { Header } from '../shared/Header';
import { useKudos } from '../../context/KudosContext';

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('received');
  const { receivedKudos, givenKudos, currentUser } = useKudos();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="dashboard-layout">
          <UserProfile />
          <div className="content-area">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'received' ? 'active' : ''}`}
                onClick={() => setActiveTab('received')}
              >
                My Kudos
                <span className="tab-badge">{receivedKudos.length}</span>
              </button>
              <button
                className={`tab ${activeTab === 'give' ? 'active' : ''}`}
                onClick={() => setActiveTab('give')}
              >
                Give Kudos
              </button>
              <button
                className={`tab ${activeTab === 'given' ? 'active' : ''}`}
                onClick={() => setActiveTab('given')}
              >
                Kudos Given
                <span className="tab-badge">{givenKudos.length}</span>
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'received' && <ReceivedKudos />}
              {activeTab === 'give' && <GiveKudos />}
              {activeTab === 'given' && <GivenKudos />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
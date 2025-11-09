import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/dashboard/Dashboard';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { KudosProvider } from './context/KudosContext';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <KudosProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/kudosdashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </KudosProvider>
    </ErrorBoundary>
  );
}

export default App;
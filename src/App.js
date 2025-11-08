import { useState } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:8000/api'; // add server url

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);


  // Login handler
  const handleLogin = async (e) => {
    return;
  };

  // login form
    return (
      <div className="app">
        <div className="login-container">
          <h1>Kudos App</h1>
          <p className="subtitle">Login to give and receive kudos</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                placeholder="Enter password"
                required
              />
            </div>
            
            {loginError && <div className="error-message">{loginError}</div>}
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
}

export default App;
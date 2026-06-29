import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import { logoutUser } from './api';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user info is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    } finally {
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  };

  return (
    <div className="App">
      <AnimatePresence mode="wait">
        {user ? (
          <Dashboard key="dashboard" user={user} onLogout={handleLogout} />
        ) : (
          <Auth key="auth" onLogin={handleLogin} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;

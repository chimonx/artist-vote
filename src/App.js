import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import ArtistForm from './ArtistForm';

function App() {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    const status = localStorage.getItem('authStatus');
    if (status) {
      setAuthStatus(status);
    }
  }, []);

  const handleLoginSuccess = (status) => {
    setAuthStatus(status);
    localStorage.setItem('authStatus', status); // Ensure the status is stored in localStorage
  };

  const handleLogout = () => {
    localStorage.removeItem('authStatus');
    setAuthStatus(null);
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            authStatus ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* ArtistForm Route */}
        <Route
          path="/"
          element={
            authStatus ? (
              <ArtistForm authStatus={authStatus} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

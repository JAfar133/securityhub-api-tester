// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';

const AppRoutes = () => {
  const { tokens } = useContext(AuthContext);

  return (
      <Routes>
        {tokens ? (
            <>
              <Route path="/" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
        ) : (
            <>
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
        )}
      </Routes>
  );
};

function App() {
  return (
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
  );
}

export default App;

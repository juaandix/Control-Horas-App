import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import HoursLog from './components/hours/HoursLog';
import HoursList from './components/hours/HoursList';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main style={styles.main}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/log-hours" element={
                <ProtectedRoute>
                  <HoursLog />
                </ProtectedRoute>
              } />
              <Route path="/my-hours" element={
                <ProtectedRoute>
                  <HoursList />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

const styles = {
  main: {
    minHeight: 'calc(100vh - 80px)',
    backgroundColor: '#ecf0f1'
  }
};

export default App;
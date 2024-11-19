import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Board from './pages/Board';
import Login from './pages/Login';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Auth from './utils/auth';
import Modal from './components/Modal';

interface AppProps {}

const App = (): JSX.Element => {
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showExpiredModal, setShowExpiredModal] = useState<boolean>(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [isActive, setIsActive] = useState<boolean>(true);

  const resetActivity = () => {
    setLastActivity(Date.now());
    setShowWarningModal(false);
    setIsActive(true);
  };

  useEffect(() => {
    if (!Auth.loggedIn()) return; // Only monitor session if user is logged in

    const handleActivity = () => {
      if (isActive) {
        resetActivity();
      }
    };

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('click', handleActivity);

    // Check session status every minute
    const interval = setInterval(() => {
      const inactiveTime = (Date.now() - lastActivity) / 1000 / 60; // in minutes

      if (inactiveTime >= 5) {
        setIsActive(false);
        setShowExpiredModal(true);
        Auth.logout(); // Logout user after 5 minutes of inactivity
      } else if (inactiveTime >= 3 && !showWarningModal) {
        setShowWarningModal(true);
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [lastActivity, isActive, showWarningModal]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route 
          path="/login" 
          element={Auth.loggedIn() ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route
          path="/"
          element={
            <ProtectedRoute children={<Board />} />
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute children={<CreateTicket />} />
          }
        />
        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute children={<EditTicket />} />
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <Modal 
        isOpen={showWarningModal}
        onClose={resetActivity}
        type="warning"
        timeRemaining={2}
      />

      <Modal 
        isOpen={showExpiredModal}
        type="expired"
      />
    </>
  );
};

export default App;
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Board from './pages/Board';
import Login from './pages/Login';
import CreateTicket from './pages/CreateTicket';
import EditTicket from './pages/EditTicket';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Auth from './utils/auth';

interface AppProps {}

const App = (): JSX.Element => {
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
    </>
  );
};

export default App;
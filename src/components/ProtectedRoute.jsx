import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  console.log('currentUser', currentUser);

  return currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

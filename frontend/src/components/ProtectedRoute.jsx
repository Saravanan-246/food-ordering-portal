// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';

export default function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    const userPhone = localStorage.getItem('userPhone');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    if (token && userPhone && isLoggedIn === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsChecking(false);
  }, []);

  // Show loading while checking
  if (isChecking) {
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading...</LoadingText>
      </LoadingContainer>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render protected content
  return children;
}

// Styled Components
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: white;
  margin-top: 20px;
  font-size: 16px;
  font-weight: 600;
`;

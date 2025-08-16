// src/components/ProtectedRoute.tsx
import React from 'react';
import { useLocation } from 'wouter';
import { auth } from '@/firebase'; // Import your Firebase auth instance

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [, setLocation] = useLocation();
  const user = auth.currentUser;

  // Check if a user is signed in
  if (!user) {
    // If no user is found, redirect to the landing page
    setLocation('/');
    return null; // Don't render the children
  }

  // If a user is found, render the children (the protected page)
  return <>{children}</>;
};

export default ProtectedRoute;
import React from 'react';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ClientDashboard } from '../pages/ClientDashboard';
import { useAuth } from '../contexts/AuthContext';

export const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Default to client dashboard for submitters and hosts
  return <ClientDashboard />;
};

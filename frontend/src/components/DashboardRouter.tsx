import React from 'react';
import { AdminDashboard } from '../pages/AdminDashboard';
import { ClientDashboard } from '../pages/ClientDashboard';
import { HostDashboard } from '../pages/HostDashboard';
import { useAuth } from '../contexts/AuthContext';

export const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  if (user?.role === 'host') {
    return <HostDashboard />;
  }

  // Default to client dashboard for submitters
  return <ClientDashboard />;
};

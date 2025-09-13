import { AccountCoordinatorDashboard } from '@/components/Dashboard/AccountCoordinatorDashboard';
import { EmployeeDashboard } from '@/components/Dashboard/EmployeeDashboard';
import { EngineeringDashboard } from '@/components/Dashboard/EngineeringDashboard';
import { FacilitiesDashboard } from '@/components/Dashboard/FacilitiesDashboard';
import { HRDashboard } from '@/components/Dashboard/HRDashboard';
import { ITDashboard } from '@/components/Dashboard/ITDashboard';
import { OperationsManagerDashboard } from '@/components/Dashboard/OperationsManagerDashboard';
import { SuperAdminDashboard } from '@/components/Dashboard/SuperAdminDashboard';
import { TeamLeaderDashboard } from '@/components/Dashboard/TeamLeaderDashboard';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case '9':
      return <SuperAdminDashboard />;
    case 'hr':
      return <HRDashboard />;
    case 'it':
      return <ITDashboard />;
    case 'team_leader':
      return <TeamLeaderDashboard />;
    case 'engineering_auxiliary':
      return <EngineeringDashboard />;
    case 'admin_facilities':
      return <FacilitiesDashboard />;
    case 'account_coordinator':
      return <AccountCoordinatorDashboard />;
    case 'operations_manager':
      return <OperationsManagerDashboard />;
    case 'employee':
      return <EmployeeDashboard />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default Dashboard;
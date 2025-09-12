import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SuperAdminDashboard } from '@/components/Dashboard/SuperAdminDashboard';
import HRDashboard from '@/components/Dashboard/HRDashboard';
import { ITDashboard } from '@/components/Dashboard/ITDashboard';
import { TeamLeaderDashboard } from '@/components/Dashboard/TeamLeaderDashboard';
import { EngineeringDashboard } from '@/components/Dashboard/EngineeringDashboard';
import { FacilitiesDashboard } from '@/components/Dashboard/FacilitiesDashboard';
import { AccountCoordinatorDashboard } from '@/components/Dashboard/AccountCoordinatorDashboard';
import { OperationsManagerDashboard } from '@/components/Dashboard/OperationsManagerDashboard';
import { EmployeeDashboard } from '@/components/Dashboard/EmployeeDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  switch (user.role) {
    case 'super_admin':
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
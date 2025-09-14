import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';
import React from 'react';
import { Outlet } from 'react-router-dom';

const roleLabels: Record<string, string> = {
  super_admin: 'Super Administrator',
  hr: 'HR Manager',
  it: 'IT Manager',
  team_leader: 'Team Leader',
  engineering_auxiliary: 'Engineering & Auxiliary',
  admin_facilities: 'Admin/Facilities',
  account_coordinator: 'Account Coordinator',
  operations_manager: 'Operations Manager',
  employee: 'Employee'
};

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Clearance Admin Tracker
              </h1>
              <Badge variant="secondary">
                {roleLabels[user.role] || user.role}
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>{user.name}</span>

              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Nested dashboards will render here */}
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
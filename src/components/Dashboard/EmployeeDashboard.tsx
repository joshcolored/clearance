import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, User, Calendar, Building } from 'lucide-react';
import { ClearanceItem, Employee } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';

interface DepartmentProgress {
  department: string;
  progress: number;
  completed: number;
  total: number;
}

interface DepartmentData {
  [key: string]: { total: number; completed: number };
}

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>([]);
  const [employeeData, setEmployeeData] = useState<Employee | null>(null);

  useEffect(() => {
    if (user?.employeeId) {
      loadClearanceItems();
      loadEmployeeData();
    }
  }, [user]);

  const loadClearanceItems = () => {
    const savedItems = localStorage.getItem('clearanceItems');
    if (savedItems && user?.employeeId) {
      const items: ClearanceItem[] = JSON.parse(savedItems);
      const userItems = items.filter(item => item.employeeId === user.employeeId);
      setClearanceItems(userItems);
    }
  };

  const loadEmployeeData = () => {
    const savedEmployees = localStorage.getItem('employees');
    if (savedEmployees && user?.employeeId) {
      const employees: Employee[] = JSON.parse(savedEmployees);
      const employee = employees.find(emp => emp.employeeId === user.employeeId);
      setEmployeeData(employee || null);
    }
  };

  const getOverallProgress = () => {
    if (clearanceItems.length === 0) return 0;
    const completedItems = clearanceItems.filter(item => item.status === 'completed');
    return Math.round((completedItems.length / clearanceItems.length) * 100);
  };

  const getDepartmentProgress = (): DepartmentProgress[] => {
    const departments: DepartmentData = clearanceItems.reduce((acc: DepartmentData, item) => {
      if (!acc[item.department]) {
        acc[item.department] = { total: 0, completed: 0 };
      }
      acc[item.department].total++;
      if (item.status === 'completed') {
        acc[item.department].completed++;
      }
      return acc;
    }, {});

    return Object.entries(departments).map(([dept, data]) => ({
      department: dept,
      progress: Math.round((data.completed / data.total) * 100),
      completed: data.completed,
      total: data.total
    }));
  };

  const formatDepartmentName = (dept: string) => {
    return dept.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const overallProgress = getOverallProgress();
  const departmentProgress = getDepartmentProgress();
  const completedTasks = clearanceItems.filter(item => item.status === 'completed').length;
  const pendingTasks = clearanceItems.filter(item => item.status === 'pending').length;

  if (!user) {
    return <div>Please log in to view your clearance progress.</div>;
  }

  return (
    <DashboardLayout title="My Clearance Progress">
      <div className="space-y-6">
        {/* Employee Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Employee Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Department</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.department}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Employee ID</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.employeeId}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <Progress value={overallProgress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {completedTasks} of {clearanceItems.length} tasks completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Tasks successfully completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingTasks}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Tasks awaiting completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Department Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Department-wise Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentProgress.map((dept) => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {formatDepartmentName(dept.department)}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {dept.completed}/{dept.total} tasks
                    </span>
                  </div>
                  <Progress value={dept.progress} className="h-2" />
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{dept.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Task List */}
        <Card>
          <CardHeader>
            <CardTitle>Clearance Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clearanceItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-medium">{item.taskName}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      <p className="text-xs text-gray-500">
                        Department: {formatDepartmentName(item.department)}
                      </p>
                    </div>
                    <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  {item.status === 'completed' && (
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      {item.completedBy && (
                        <span>Completed by: {item.completedBy}</span>
                      )}
                      {item.completedAt && (
                        <span>Date: {new Date(item.completedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  )}
                  
                  {item.remarks && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Remarks:</span> {item.remarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Clearance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Current Status:</span>
                <Badge variant={
                  overallProgress === 100 ? 'default' : 
                  overallProgress > 0 ? 'secondary' : 'outline'
                }>
                  {overallProgress === 100 ? 'Cleared' : 
                   overallProgress > 0 ? 'In Progress' : 'Pending'}
                </Badge>
              </div>
              
              {employeeData?.resignationDate && (
                <div className="flex justify-between items-center">
                  <span>Resignation Date:</span>
                  <span className="text-sm">
                    {new Date(employeeData.resignationDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {overallProgress === 100 
                    ? '🎉 Congratulations! Your clearance process is complete.'
                    : `You have ${pendingTasks} pending task${pendingTasks !== 1 ? 's' : ''} remaining. Please coordinate with the respective departments to complete your clearance.`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
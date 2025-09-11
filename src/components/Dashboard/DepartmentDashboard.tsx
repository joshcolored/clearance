import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, Clock, FileText, PenTool } from 'lucide-react';
import { ClearanceItem, Employee, UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface DepartmentDashboardProps {
  userRole: UserRole;
}

export const DepartmentDashboard: React.FC<DepartmentDashboardProps> = ({ userRole }) => {
  const { user } = useAuth();
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedItem, setSelectedItem] = useState<ClearanceItem | null>(null);
  const [remarks, setRemarks] = useState('');
  const [signature, setSignature] = useState('');

  useEffect(() => {
    const savedItems = localStorage.getItem('clearanceItems');
    const savedEmployees = localStorage.getItem('employees');
    
    if (savedItems) {
      const allItems = JSON.parse(savedItems);
      const departmentItems = allItems.filter((item: ClearanceItem) => item.department === userRole);
      setClearanceItems(departmentItems);
    }
    
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  }, [userRole]);

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };

  const getEmployeeDetails = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId);
  };

  const handleCompleteTask = (item: ClearanceItem) => {
    const updatedItems = clearanceItems.map(clearanceItem => {
      if (clearanceItem.id === item.id) {
        return {
          ...clearanceItem,
          status: 'completed' as const,
          completedBy: user?.name || '',
          completedAt: new Date().toISOString(),
          remarks,
          signature: signature || `Digital signature by ${user?.name}`
        };
      }
      return clearanceItem;
    });

    setClearanceItems(updatedItems);
    
    // Update localStorage
    const allItems = JSON.parse(localStorage.getItem('clearanceItems') || '[]');
    const updatedAllItems = allItems.map((allItem: ClearanceItem) => {
      const updated = updatedItems.find(ui => ui.id === allItem.id);
      return updated || allItem;
    });
    localStorage.setItem('clearanceItems', JSON.stringify(updatedAllItems));

    setSelectedItem(null);
    setRemarks('');
    setSignature('');
  };

  const pendingItems = clearanceItems.filter(item => item.status === 'pending');
  const completedItems = clearanceItems.filter(item => item.status === 'completed');

  const departmentLabels: Record<UserRole, string> = {
    super_admin: 'Super Administrator',
    hr: 'Human Resources',
    it: 'Information Technology',
    team_leader: 'Team Leader',
    engineering_auxiliary: 'Engineering & Auxiliary',
    admin_facilities: 'Admin/Facilities',
    account_coordinator: 'Account Coordinator',
    operations_manager: 'Operations Manager'
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedItems.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clearanceItems.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-orange-500" />
            Pending Clearance Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending tasks</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingItems.map((item) => {
                  const employee = getEmployeeDetails(item.employeeId);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{getEmployeeName(item.employeeId)}</div>
                          <div className="text-sm text-gray-500">
                            ID: {employee?.employeeId} | Dept: {employee?.department}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.taskName}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{departmentLabels[item.department]}</Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedItem(item)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Complete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Complete Clearance Task</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p><strong>Employee:</strong> {getEmployeeName(item.employeeId)}</p>
                                <p><strong>Task:</strong> {item.taskName}</p>
                                <p><strong>Description:</strong> {item.description}</p>
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium mb-2">Remarks</label>
                                <Textarea
                                  value={remarks}
                                  onChange={(e) => setRemarks(e.target.value)}
                                  placeholder="Add any remarks or notes..."
                                  rows={3}
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium mb-2">Digital Signature</label>
                                <div className="flex items-center space-x-2">
                                  <PenTool className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600">
                                    Signed by: {user?.name}
                                  </span>
                                </div>
                              </div>

                              <Button 
                                onClick={() => selectedItem && handleCompleteTask(selectedItem)}
                                className="w-full"
                              >
                                Complete Task & Sign
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Completed Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No completed tasks</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Completed By</TableHead>
                  <TableHead>Completed At</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{getEmployeeName(item.employeeId)}</TableCell>
                    <TableCell>{item.taskName}</TableCell>
                    <TableCell>{item.completedBy}</TableCell>
                    <TableCell>
                      {item.completedAt ? new Date(item.completedAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>{item.remarks || 'No remarks'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
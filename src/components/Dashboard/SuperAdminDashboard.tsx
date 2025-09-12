import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Employee, ClearanceItem, UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const clearanceTemplate = {
  hr: [
    { taskName: 'Finalize Payroll', description: 'Complete final payroll processing', requiresSignature: true },
    { taskName: 'Settle Benefits', description: 'Process accrued leave and benefits', requiresSignature: true },
    { taskName: 'Clear Financial Obligations', description: 'Settle cash advances and loans', requiresSignature: true },
    { taskName: 'Document Return', description: 'Ensure all company documents are returned', requiresSignature: true }
  ],
  it: [
    { taskName: 'Delete System Access', description: 'Remove computer and payslip access', requiresSignature: true },
    { taskName: 'Collect Mobile Phone', description: 'Retrieve company mobile phone', requiresSignature: true }
  ],
  team_leader: [
    { taskName: 'Clearance Verification', description: 'Verify and provide signature for clearance', requiresSignature: true }
  ],
  engineering_auxiliary: [
    { taskName: 'Return Company ID', description: 'Collect company identification card', requiresSignature: true },
    { taskName: 'Return Headset', description: 'Collect company headset', requiresSignature: true }
  ],
  admin_facilities: [
    { taskName: 'Damage Assessment', description: 'Check for any company property damages', requiresSignature: true }
  ],
  account_coordinator: [
    { taskName: 'Account Confirmation', description: 'Confirm and provide signature', requiresSignature: true }
  ],
  operations_manager: [
    { taskName: 'Operations Confirmation', description: 'Confirm and provide signature', requiresSignature: true }
  ]
};

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    employeeId: '',
    department: '',
    resignationDate: ''
  });

  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    const savedItems = localStorage.getItem('clearanceItems');
    
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
    if (savedItems) {
      setClearanceItems(JSON.parse(savedItems));
    }
  }, []);

  const saveEmployees = (updatedEmployees: Employee[]) => {
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  const createClearanceItems = (employeeId: string) => {
    const newClearanceItems: ClearanceItem[] = [];
    
    Object.entries(clearanceTemplate).forEach(([dept, tasks]) => {
      tasks.forEach((task, index) => {
        newClearanceItems.push({
          id: `${employeeId}-${dept}-${index}`,
          employeeId,
          department: dept as UserRole,
          taskName: task.taskName,
          description: task.description,
          status: 'pending',
          assignedTo: dept,
          remarks: ''
        });
      });
    });

    const existingItems = JSON.parse(localStorage.getItem('clearanceItems') || '[]');
    const updatedItems = [...existingItems, ...newClearanceItems];
    localStorage.setItem('clearanceItems', JSON.stringify(updatedItems));
    setClearanceItems(updatedItems);
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.employeeId || !newEmployee.department || !newEmployee.resignationDate) {
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      ...newEmployee,
      status: 'in_clearance',
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Super Admin',
      ntlogin: ''
    };

    const updatedEmployees = [...employees, employee];
    saveEmployees(updatedEmployees);
    createClearanceItems(employee.id);

    setNewEmployee({ name: '', employeeId: '', department: '', resignationDate: '' });
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = () => {
    if (!editingEmployee) return;

    const updatedEmployees = employees.map(emp => 
      emp.id === editingEmployee.id ? editingEmployee : emp
    );
    saveEmployees(updatedEmployees);
    setEditingEmployee(null);
    setIsEditDialogOpen(false);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    saveEmployees(updatedEmployees);
    
    // Also remove clearance items
    const existingItems = JSON.parse(localStorage.getItem('clearanceItems') || '[]');
    const filteredItems = existingItems.filter((item: ClearanceItem) => item.employeeId !== employeeId);
    localStorage.setItem('clearanceItems', JSON.stringify(filteredItems));
    setClearanceItems(filteredItems);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee({ ...employee });
    setIsEditDialogOpen(true);
  };

  const getEmployeeClearanceItems = (employeeId: string) => {
    return clearanceItems.filter(item => item.employeeId === employeeId);
  };

  const getEmployeeProgress = (employeeId: string) => {
    const employeeItems = getEmployeeClearanceItems(employeeId);
    const completedItems = employeeItems.filter(item => item.status === 'completed');
    
    if (employeeItems.length === 0) return 0;
    return Math.round((completedItems.length / employeeItems.length) * 100);
  };

  return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">In Clearance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {employees.filter(emp => emp.status === 'in_clearance').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cleared</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {employees.filter(emp => emp.status === 'cleared').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {employees.filter(emp => emp.status === 'active').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Employee Management</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Employee</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Employee Name</Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                      placeholder="Enter employee name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={newEmployee.employeeId}
                      onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                      placeholder="Enter employee ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                      placeholder="Enter department"
                    />
                  </div>
                  <div>
                    <Label htmlFor="resignationDate">Resignation Date</Label>
                    <Input
                      id="resignationDate"
                      type="date"
                      value={newEmployee.resignationDate}
                      onChange={(e) => setNewEmployee({...newEmployee, resignationDate: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleAddEmployee} className="w-full">
                    Add Employee
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Name</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Resignation Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{new Date(employee.resignationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      employee.status === 'cleared' ? 'default' : 
                      employee.status === 'in_clearance' ? 'secondary' : 'outline'
                    }>
                      {employee.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getEmployeeProgress(employee.id)}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewEmployee(employee)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClick(employee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the employee
                              "{employee.name}" and all associated clearance data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteEmployee(employee.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Employee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Employee Details - {selectedEmployee?.name}</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p><strong>Employee ID:</strong> {selectedEmployee.employeeId}</p>
                  <p><strong>Department:</strong> {selectedEmployee.department}</p>
                  <p><strong>Status:</strong> {selectedEmployee.status.replace('_', ' ').toUpperCase()}</p>
                </div>
                <div>
                  <p><strong>Resignation Date:</strong> {new Date(selectedEmployee.resignationDate).toLocaleDateString()}</p>
                  <p><strong>Created By:</strong> {selectedEmployee.createdBy}</p>
                  <p><strong>Progress:</strong> {getEmployeeProgress(selectedEmployee.id)}%</p>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Completed By</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getEmployeeClearanceItems(selectedEmployee.id).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="capitalize">{item.department.replace('_', ' ')}</TableCell>
                        <TableCell>{item.taskName}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.completedBy || 'N/A'}</TableCell>
                        <TableCell>{item.remarks || 'No remarks'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Employee Name</Label>
                <Input
                  id="edit-name"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({...editingEmployee, name: e.target.value})}
                  placeholder="Enter employee name"
                />
              </div>
              <div>
                <Label htmlFor="edit-employeeId">Employee ID</Label>
                <Input
                  id="edit-employeeId"
                  value={editingEmployee.employeeId}
                  onChange={(e) => setEditingEmployee({...editingEmployee, employeeId: e.target.value})}
                  placeholder="Enter employee ID"
                />
              </div>
              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={editingEmployee.department}
                  onChange={(e) => setEditingEmployee({...editingEmployee, department: e.target.value})}
                  placeholder="Enter department"
                />
              </div>
              <div>
                <Label htmlFor="edit-resignationDate">Resignation Date</Label>
                <Input
                  id="edit-resignationDate"
                  type="date"
                  value={editingEmployee.resignationDate}
                  onChange={(e) => setEditingEmployee({...editingEmployee, resignationDate: e.target.value})}
                />
              </div>
              <Button onClick={handleEditEmployee} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SuperAdminDashboard;
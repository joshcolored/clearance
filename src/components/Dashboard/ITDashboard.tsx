import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Monitor, Smartphone, CheckCircle, Clock, AlertCircle, Users } from 'lucide-react';
import { ClearanceItem, Employee } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { CustomPieChart } from '@/components/Charts/PieChart';
import { CustomBarChart } from '@/components/Charts/BarChart';

const ITDashboard = () => {
  const { user } = useAuth();
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTask, setSelectedTask] = useState<ClearanceItem | null>(null);
  const [signature, setSignature] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedItems = localStorage.getItem('clearanceItems');
    const savedEmployees = localStorage.getItem('employees');
    
    if (savedItems) {
      const items: ClearanceItem[] = JSON.parse(savedItems);
      const itItems = items.filter(item => item.department === 'it');
      setClearanceItems(itItems);
    }
    
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  };

  const completeTask = () => {
    if (!selectedTask || !signature) return;

    const updatedItems = clearanceItems.map(item =>
      item.id === selectedTask.id
        ? {
            ...item,
            status: 'completed' as const,
            completedBy: user?.name || 'IT Manager',
            completedAt: new Date().toISOString(),
            signature,
            remarks
          }
        : item
    );

    setClearanceItems(updatedItems);
    
    // Update localStorage
    const allItems = JSON.parse(localStorage.getItem('clearanceItems') || '[]');
    const updatedAllItems = allItems.map((item: ClearanceItem) =>
      item.id === selectedTask.id
        ? updatedItems.find(ui => ui.id === item.id) || item
        : item
    );
    localStorage.setItem('clearanceItems', JSON.stringify(updatedAllItems));

    setIsDialogOpen(false);
    setSelectedTask(null);
    setSignature('');
    setRemarks('');
  };

  const openTaskDialog = (task: ClearanceItem) => {
    setSelectedTask(task);
    setSignature('');
    setRemarks('');
    setIsDialogOpen(true);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };

  // Chart data
  const statusData = [
    { name: 'Completed', value: clearanceItems.filter(item => item.status === 'completed').length, color: '#22c55e' },
    { name: 'Pending', value: clearanceItems.filter(item => item.status === 'pending').length, color: '#f59e0b' }
  ];

  const taskTypeData = [
    { 
      name: 'System Access', 
      completed: clearanceItems.filter(item => item.taskName.includes('System') && item.status === 'completed').length,
      pending: clearanceItems.filter(item => item.taskName.includes('System') && item.status === 'pending').length,
      total: clearanceItems.filter(item => item.taskName.includes('System')).length
    },
    { 
      name: 'Equipment Return', 
      completed: clearanceItems.filter(item => item.taskName.includes('Equipment') && item.status === 'completed').length,
      pending: clearanceItems.filter(item => item.taskName.includes('Equipment') && item.status === 'pending').length,
      total: clearanceItems.filter(item => item.taskName.includes('Equipment')).length
    }
  ];

  const completedTasks = clearanceItems.filter(item => item.status === 'completed').length;
  const pendingTasks = clearanceItems.filter(item => item.status === 'pending').length;
  const totalEmployees = new Set(clearanceItems.map(item => item.employeeId)).size;

  return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Monitor className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clearanceItems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingTasks}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <CustomPieChart data={statusData} title="Task Status Distribution" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <CustomBarChart data={taskTypeData} title="IT Task Categories" />
            </CardContent>
          </Card>
        </div>

        {/* Tasks Table */}
        <Card>
          <CardHeader>
            <CardTitle>IT Clearance Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completed By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clearanceItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {getEmployeeName(item.employeeId)}
                    </TableCell>
                    <TableCell>{item.taskName}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.completedBy || '-'}</TableCell>
                    <TableCell>
                      {item.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openTaskDialog(item)}
                        >
                          Complete
                        </Button>
                      )}
                      {item.status === 'completed' && (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Done
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Complete Task Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete IT Task</DialogTitle>
              <DialogDescription>
                Mark this task as completed and add your signature
              </DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Employee</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {getEmployeeName(selectedTask.employeeId)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Task</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.taskName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
                </div>
                <div>
                  <Label htmlFor="signature">Digital Signature *</Label>
                  <Textarea
                    id="signature"
                    placeholder="Enter your full name as digital signature"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="remarks">Remarks (Optional)</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Add any additional notes or remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={completeTask} disabled={!signature}>
                    Complete Task
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
};
export default ITDashboard;
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Employee, ClearanceItem } from "@/types";
import { CustomPieChart } from "@/components/Charts/PieChart";
import { CustomBarChart } from "@/components/Charts/BarChart";
import { Textarea } from "../ui/textarea";
import  DashboardLayout  from "../Layout/DashboardLayout";

interface DepartmentData {
  name: string;
  completed: number;
  pending: number;
  total: number;
}

export const HRDashboard: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<ClearanceItem | null>(null);
  const [signature, setSignature] = useState("");
  const [remarks, setRemarks] = useState("");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clearanceItems, setClearanceItems] = useState<ClearanceItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    employeeId: "",
    ntlogin: "",
    department: "",
    resignationDate: "",
  });

  useEffect(() => {
    loadEmployees();
    loadClearanceItems();
  }, []);

  const loadEmployees = () => {
    const savedEmployees = localStorage.getItem("employees");
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    }
  };

  const loadClearanceItems = () => {
    const savedItems = localStorage.getItem("clearanceItems");
    if (savedItems) {
      setClearanceItems(JSON.parse(savedItems));
    }
  };

  const saveEmployees = (updatedEmployees: Employee[]) => {
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));
    setEmployees(updatedEmployees);
  };

  const addEmployee = () => {
    if (
      !newEmployee.name ||
      !newEmployee.employeeId ||
      !newEmployee.ntlogin ||
      !newEmployee.department ||
      !newEmployee.resignationDate
    ) {
      return;
    }

    const employee: Employee = {
      id: Date.now().toString(),
      name: newEmployee.name,
      employeeId: newEmployee.employeeId,
      ntlogin: newEmployee.ntlogin,
      department: newEmployee.department,
      resignationDate: newEmployee.resignationDate,
      status: "in_clearance",
      createdAt: new Date().toISOString(),
      createdBy: "HR Manager",
    };

    const updatedEmployees = [...employees, employee];
    saveEmployees(updatedEmployees);

    // Create clearance items for the new employee
    createClearanceItemsForEmployee(employee);

    setNewEmployee({
      name: "",
      employeeId: "",
      ntlogin: "",
      department: "",
      resignationDate: "",
    });
    setIsAddDialogOpen(false);
  };

  const createClearanceItemsForEmployee = (employee: Employee) => {
    const clearanceTasks = [
      {
        department: "hr",
        taskName: "Final Pay Calculation",
        description: "Calculate final salary and benefits",
      },
      {
        department: "hr",
        taskName: "Exit Interview",
        description: "Conduct exit interview and documentation",
      },
      {
        department: "it",
        taskName: "System Access Revocation",
        description: "Revoke all system access and accounts",
      },
      {
        department: "it",
        taskName: "Equipment Return",
        description: "Return laptop, phone, and other IT equipment",
      },
      {
        department: "team_leader",
        taskName: "Project Handover",
        description: "Complete handover of ongoing projects",
      },
      {
        department: "engineering_auxiliary",
        taskName: "Asset Return",
        description: "Return company assets and equipment",
      },
      {
        department: "admin_facilities",
        taskName: "Facility Access",
        description: "Return ID card and facility access cards",
      },
      {
        department: "account_coordinator",
        taskName: "Financial Clearance",
        description: "Clear all financial obligations",
      },
      {
        department: "operations_manager",
        taskName: "Final Approval",
        description: "Final clearance approval",
      },
    ];

    const newClearanceItems = clearanceTasks.map((task) => ({
      id: `${employee.id}-${task.department}-${Date.now()}`,
      employeeId: employee.id,
      department: task.department as any,
      taskName: task.taskName,
      description: task.description,
      status: "pending" as const,
      assignedTo: task.department,
    }));

    const updatedItems = [...clearanceItems, ...newClearanceItems];
    localStorage.setItem("clearanceItems", JSON.stringify(updatedItems));
    setClearanceItems(updatedItems);
  };

  const editEmployee = () => {
    if (
      !selectedEmployee ||
      !newEmployee.name ||
      !newEmployee.employeeId ||
      !newEmployee.ntlogin ||
      !newEmployee.department ||
      !newEmployee.resignationDate
    ) {
      return;
    }

    const updatedEmployees = employees.map((emp) =>
      emp.id === selectedEmployee.id ? { ...emp, ...newEmployee } : emp
    );

    saveEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
    setNewEmployee({
      name: "",
      employeeId: "",
      ntlogin: "",
      department: "",
      resignationDate: "",
    });
  };

  const deleteEmployee = (employeeId: string) => {
    const updatedEmployees = employees.filter((emp) => emp.id !== employeeId);
    saveEmployees(updatedEmployees);

    // Remove clearance items for deleted employee
    const updatedItems = clearanceItems.filter(
      (item) => item.employeeId !== employeeId
    );
    localStorage.setItem("clearanceItems", JSON.stringify(updatedItems));
    setClearanceItems(updatedItems);
  };

  const openEditDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setNewEmployee({
      name: employee.name,
      employeeId: employee.employeeId,
      ntlogin: employee.ntlogin,
      department: employee.department,
      resignationDate: employee.resignationDate,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  const getEmployeeClearanceProgress = (employeeId: string) => {
    const employeeTasks = clearanceItems.filter(
      (item) => item.employeeId === employeeId
    );
    const completedTasks = employeeTasks.filter(
      (item) => item.status === "completed"
    );
    return employeeTasks.length > 0
      ? Math.round((completedTasks.length / employeeTasks.length) * 100)
      : 0;
  };

  // Chart data
  const statusData = [
    {
      name: "Active",
      value: employees.filter((e) => e.status === "active").length,
      color: "#22c55e",
    },
    {
      name: "In Clearance",
      value: employees.filter((e) => e.status === "in_clearance").length,
      color: "#f59e0b",
    },
    {
      name: "Cleared",
      value: employees.filter((e) => e.status === "cleared").length,
      color: "#3b82f6",
    },
  ];

  const openTaskDialog = (task: ClearanceItem) => {
    setSelectedTask(task);
    setSignature("");
    setRemarks("");
    setIsTaskDialogOpen(true);
  };

  const completeTask = () => {
    if (!selectedTask || !signature) return;

    const updatedItems = clearanceItems.map((item) =>
      item.id === selectedTask.id
        ? {
            ...item,
            status: "completed" as const,
            completedBy: "HR Manager",
            completedAt: new Date().toISOString(),
            signature,
            remarks,
          }
        : item
    );

    setClearanceItems(updatedItems);

    // Update localStorage
    const allItems = JSON.parse(localStorage.getItem("clearanceItems") || "[]");
    const updatedAllItems = allItems.map((item: ClearanceItem) =>
      item.id === selectedTask.id
        ? updatedItems.find((ui) => ui.id === item.id) || item
        : item
    );
    localStorage.setItem("clearanceItems", JSON.stringify(updatedAllItems));

    setIsTaskDialogOpen(false);
    setSelectedTask(null);
    setSignature("");
    setRemarks("");
  };

  const departmentData: DepartmentData[] = employees.reduce(
    (acc: DepartmentData[], emp) => {
      const existing = acc.find((item) => item.name === emp.department);
      if (existing) {
        existing.total += 1;
        if (emp.status === "cleared") existing.completed += 1;
        else existing.pending += 1;
      } else {
        acc.push({
          name: emp.department,
          completed: emp.status === "cleared" ? 1 : 0,
          pending: emp.status !== "cleared" ? 1 : 0,
          total: 1,
        });
      }
      return acc;
    },
    []
  );

  return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                In Clearance
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {employees.filter((e) => e.status === "in_clearance").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cleared</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {employees.filter((e) => e.status === "cleared").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Tasks
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {
                  clearanceItems.filter((item) => item.status === "pending")
                    .length
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <CustomPieChart
                data={statusData}
                title="Employee Status Distribution"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <CustomBarChart
                data={departmentData}
                title="Department Clearance Progress"
              />
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
                    <DialogDescription>
                      Add a new employee to the clearance system
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newEmployee.name}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            name: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="employeeId" className="text-right">
                        Employee ID
                      </Label>
                      <Input
                        id="employeeId"
                        value={newEmployee.employeeId}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            employeeId: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ntlogin" className="text-right">
                        NT Login
                      </Label>
                      <Input
                        id="ntlogin"
                        value={newEmployee.ntlogin}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            ntlogin: e.target.value,
                          })
                        }
                        className="col-span-3"
                        placeholder="e.g., jdoe"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="department" className="text-right">
                        Department
                      </Label>
                      <Input
                        id="department"
                        value={newEmployee.department}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            department: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="resignationDate" className="text-right">
                        Resignation Date
                      </Label>
                      <Input
                        id="resignationDate"
                        type="date"
                        value={newEmployee.resignationDate}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            resignationDate: e.target.value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={addEmployee}>Add Employee</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>NT Login</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.name}
                    </TableCell>
                    <TableCell>{employee.employeeId}</TableCell>
                    <TableCell>{employee.ntlogin}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.status === "cleared"
                            ? "default"
                            : employee.status === "in_clearance"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {employee.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${getEmployeeClearanceProgress(
                                employee.id
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {getEmployeeClearanceProgress(employee.id)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openViewDialog(employee)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(employee)}
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
                                This action cannot be undone. This will
                                permanently delete the employee record and all
                                associated clearance data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteEmployee(employee.id)}
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>Update employee information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={newEmployee.name}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, name: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-employeeId" className="text-right">
                  Employee ID
                </Label>
                <Input
                  id="edit-employeeId"
                  value={newEmployee.employeeId}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      employeeId: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-ntlogin" className="text-right">
                  NT Login
                </Label>
                <Input
                  id="edit-ntlogin"
                  value={newEmployee.ntlogin}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, ntlogin: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-department" className="text-right">
                  Department
                </Label>
                <Input
                  id="edit-department"
                  value={newEmployee.department}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      department: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-resignationDate" className="text-right">
                  Resignation Date
                </Label>
                <Input
                  id="edit-resignationDate"
                  type="date"
                  value={newEmployee.resignationDate}
                  onChange={(e) =>
                    setNewEmployee({
                      ...newEmployee,
                      resignationDate: e.target.value,
                    })
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={editEmployee}>Update Employee</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
              <DialogDescription>
                View employee information and clearance progress
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedEmployee.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Employee ID</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedEmployee.employeeId}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">NT Login</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedEmployee.ntlogin}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Department</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedEmployee.department}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge
                      variant={
                        selectedEmployee.status === "cleared"
                          ? "default"
                          : selectedEmployee.status === "in_clearance"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {selectedEmployee.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Progress</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getEmployeeClearanceProgress(selectedEmployee.id)}%
                      Complete
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Clearance Tasks
                  </Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead>Task</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Completed By</TableHead>
                        <TableHead>Completed At</TableHead>
                        <TableHead>Actions</TableHead> {/* NEW */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clearanceItems
                        .filter(
                          (item) => item.employeeId === selectedEmployee.id
                        )
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="capitalize">
                              {item.department.replace("_", " ")}
                            </TableCell>
                            <TableCell>{item.taskName}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.status === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{item.completedBy || "-"}</TableCell>
                            <TableCell>
                              {item.completedAt
                                ? new Date(
                                    item.completedAt
                                  ).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {item.status === "pending" &&
                                item.department === "hr" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openTaskDialog(item)}
                                  >
                                    Complete
                                  </Button>
                                )}
                              {item.status === "completed" && (
                                <Badge
                                  variant="outline"
                                  className="text-green-600"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Done
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
        {/* Complete Task Dialog */}
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete HR Task</DialogTitle>
              <DialogDescription>
                Mark this task as completed and add your signature
              </DialogDescription>
            </DialogHeader>
            {selectedTask && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Task</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTask.taskName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTask.description}
                  </p>
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
                  <Button
                    variant="outline"
                    onClick={() => setIsTaskDialogOpen(false)}
                  >
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
export default HRDashboard;
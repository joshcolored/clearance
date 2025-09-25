import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 📊 Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_URL = "http://localhost:8000/api"; // Change this if backend is hosted elsewhere

interface Employee {
  id: number;
  name: string;
  employeeId: string;
  ntlogin: string;
  department: string;
  resignationDate: string;
  status: string;
  clearance_items: ClearanceItem[]; // ✅ updated to match backend
}

interface ClearanceItem {
  id: number;
  department: string;
  taskName: string;
  description: string;
  status: "pending" | "completed";
  completedBy?: string;
  completedAt?: string;
  signature?: string;
  remarks?: string;
}

const HRDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({});
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [selectedTask, setSelectedTask] = useState<ClearanceItem | null>(null);

  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const [signature, setSignature] = useState("");
  const [remarks, setRemarks] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  // 🔹 Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(employees.length / itemsPerPage);

  // 📊 Compute clearance stats
  const clearanceStats = employees.reduce(
    (acc, emp) => {
      const tasks = emp.clearance_items || [];
      if (tasks.length > 0 && tasks.every((t) => t.status === "completed")) {
        acc.completed++;
      } else {
        acc.pending++;
      }
      return acc;
    },
    { completed: 0, pending: 0 }
  );

  const chartData = [
    { name: "Completed", value: clearanceStats.completed },
    { name: "Pending", value: clearanceStats.pending },
  ];

  // 🔹 Load employees from backend
  const loadEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  // 🔹 Add employee
  const addEmployee = async () => {
    if (!newEmployee.name || !newEmployee.employeeId || !newEmployee.ntlogin)
      return;

    try {
      const res = await axios.post(`${API_URL}/employees`, newEmployee);
      setEmployees([...employees, res.data]);
      setIsAddDialogOpen(false);
      setNewEmployee({});
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  // 🔹 Edit employee
  const editEmployee = async () => {
    if (!selectedEmployee) return;

    try {
      const res = await axios.put(
        `${API_URL}/employees/${selectedEmployee.id}`,
        newEmployee
      );
      setEmployees(
        employees.map((emp) => (emp.id === res.data.id ? res.data : emp))
      );
      setIsEditDialogOpen(false);
      setNewEmployee({});
    } catch (error) {
      console.error("Error editing employee:", error);
    }
  };

  // 🔹 Delete employee
  const deleteEmployee = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/employees/${id}`);
      setEmployees(employees.filter((emp) => emp.id !== id));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // 🔹 Complete task
  const completeTask = async () => {
    if (!selectedTask || !signature) return;

    try {
      const res = await axios.post(
        `${API_URL}/clearance-items/${selectedTask.id}/complete`,
        {
          signature,
          remarks,
          completedBy: "HR Manager", // Or logged-in role
        }
      );

      // 🔹 Update employees state
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee?.id
            ? {
                ...emp,
                clearance_items: emp.clearance_items.map((item) =>
                  item.id === res.data.id ? res.data : item
                ),
              }
            : emp
        )
      );

      setSelectedEmployee((prev) =>
        prev
          ? {
              ...prev,
              clearance_items: prev.clearance_items.map((item) =>
                item.id === res.data.id ? res.data : item
              ),
            }
          : prev
      );

      // 🔹 Check if all tasks are complete → update employee status
      const updatedTasks = selectedEmployee?.clearance_items.map((item) =>
        item.id === res.data.id ? res.data : item
      );

      if (updatedTasks && updatedTasks.every((t) => t.status === "completed")) {
        await axios.put(`${API_URL}/employees/${selectedEmployee?.id}`, {
          status: "completed",
        });

        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === selectedEmployee?.id
              ? { ...emp, status: "completed" }
              : emp
          )
        );

        setSelectedEmployee((prev) =>
          prev ? { ...prev, status: "completed" } : prev
        );
      }

      // reset + close
      setSelectedTask(null);
      setSignature("");
      setRemarks("");
      setIsCompleteDialogOpen(false);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">HR Dashboard</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>+ Add Employee</Button>
      </div>

      {/* Clearance Overview (Bar Chart) */}
      <Card>
        <CardHeader>
          <CardTitle>Clearance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employees</CardTitle>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.employeeId}</TableCell>
                  <TableCell>{emp.ntlogin}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>
                    {emp.status === "in_clearance" ? (
                      <div className="space-y-1">
                        <p className="text-sm font-medium">In Progress</p>
                        {emp.clearance_items?.length > 0 && (
                          <Progress
                            value={
                              (emp.clearance_items.filter(
                                (t) => t.status === "completed"
                              ).length /
                                emp.clearance_items.length) *
                              100
                            }
                            className="w-[150px] h-2 [&>div]:bg-blue-500"
                          />
                        )}
                        <p className="text-xs text-gray-500">
                          {
                            emp.clearance_items.filter(
                              (t) => t.status === "completed"
                            ).length
                          }{" "}
                          / {emp.clearance_items.length} tasks
                        </p>
                      </div>
                    ) : emp.status === "completed" ? (
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    ) : (
                      emp.status
                    )}
                  </TableCell>

                  <TableCell className="space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setNewEmployee(emp);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setEmployeeToDelete(emp);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>

                    <Button
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setSelectedTask(null); // ✅ reset selectedTask when opening dialog
                        setIsTaskDialogOpen(true);
                      }}
                    >
                      View Task
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-center space-x-2 mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>{employeeToDelete?.name}</strong>? This action cannot be
            undone.
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (employeeToDelete) {
                  await deleteEmployee(employeeToDelete.id);
                }
                setIsDeleteDialogOpen(false);
                setEmployeeToDelete(null);
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={newEmployee.name || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
            />
            <Label>Employee ID</Label>
            <Input
              value={newEmployee.employeeId || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, employeeId: e.target.value })
              }
            />
            <Label>NT Login</Label>
            <Input
              value={newEmployee.ntlogin || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, ntlogin: e.target.value })
              }
            />
            <Label>Department</Label>
            <Input
              value={newEmployee.department || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, department: e.target.value })
              }
            />
            <Label>Resignation Date</Label>
            <Input
              type="date"
              value={newEmployee.resignationDate || ""}
              onChange={(e) =>
                setNewEmployee({
                  ...newEmployee,
                  resignationDate: e.target.value,
                })
              }
            />
            <Button onClick={addEmployee}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              value={newEmployee.name || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
            />
            <Label>Department</Label>
            <Input
              value={newEmployee.department || ""}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, department: e.target.value })
              }
            />
            <Button onClick={editEmployee}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Task List Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Clearance Tasks</DialogTitle>
          </DialogHeader>

          {selectedEmployee?.clearance_items?.length ? (
            <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
              {selectedEmployee?.clearance_items?.map((task) => (
                <Card
                  key={task.id}
                  className={`p-3 ${
                    task.status === "completed"
                      ? "bg-gray-100 text-gray-600"
                      : ""
                  }`}
                >
                  <p>
                    <strong>Task:</strong> {task.taskName}
                  </p>
                  <p>
                    <strong>Department:</strong> {task.department}
                  </p>
                  <p>
                    <strong>Status:</strong> {task.status}
                  </p>

                  {task.status === "completed" ? (
                    <div className="mt-2 space-y-1">
                      <p>
                        <strong>Signed By:</strong> {task.signature || "N/A"}
                      </p>
                      <p>
                        <strong>Remarks:</strong> {task.remarks || "None"}
                      </p>
                      <p>
                        <strong>Completed At:</strong>{" "}
                        {task.completedAt || "Unknown"}
                      </p>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setSelectedTask(task);
                        setSignature("");
                        setRemarks("");
                        setIsCompleteDialogOpen(true);
                      }}
                    >
                      Complete
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <p>No clearance tasks found.</p>
          )}
        </DialogContent>
      </Dialog>

      {/* Complete Task Dialog */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-2">
              <p>
                <strong>Task:</strong> {selectedTask.taskName}
              </p>
              <p>
                <strong>Department:</strong> {selectedTask.department}
              </p>

              <Label>Signature</Label>
              <Input
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
              />

              <Label>Remarks</Label>
              <Input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />

              <Button
                className="mt-3"
                onClick={async () => {
                  await completeTask();
                  setIsCompleteDialogOpen(false); // close after submit
                }}
              >
                Submit
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRDashboard;

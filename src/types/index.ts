export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  department: string;
  employeeId?: string; // For employee users to link to their clearance data
  ntlogin?: string; // For employee NT login authentication
}

export type UserRole = 
  | 'super_admin'
  | 'hr'
  | 'it'
  | 'team_leader'
  | 'engineering_auxiliary'
  | 'admin_facilities'
  | 'account_coordinator'
  | 'operations_manager'
  | 'employee';

export interface Employee {
  id: string;
  name: string;
  employeeId: string;
  ntlogin: string; // NT login for employee authentication
  department: string;
  resignationDate: string;
  status: 'active' | 'in_clearance' | 'cleared';
  createdAt: string;
  createdBy: string;
}

export interface ClearanceItem {
  id: string;
  employeeId: string;
  department: UserRole;
  taskName: string;
  description: string;
  status: 'pending' | 'completed';
  assignedTo: string;
  completedBy?: string;
  completedAt?: string;
  signature?: string;
  remarks?: string;
}

export interface ClearanceTemplate {
  hr: ClearanceTaskTemplate[];
  it: ClearanceTaskTemplate[];
  team_leader: ClearanceTaskTemplate[];
  engineering_auxiliary: ClearanceTaskTemplate[];
  admin_facilities: ClearanceTaskTemplate[];
  account_coordinator: ClearanceTaskTemplate[];
  operations_manager: ClearanceTaskTemplate[];
}

export interface ClearanceTaskTemplate {
  taskName: string;
  description: string;
  requiresSignature: boolean;
}

export interface ElectronicSignature {
  id: string;
  employeeId: string;
  department: UserRole;
  signedBy: string;
  signedAt: string;
  signatureData: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
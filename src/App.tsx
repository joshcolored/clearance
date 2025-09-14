import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from './pages/Index';
import DashboardLayout from './components/Layout/DashboardLayout';
import HRDashboard from './components/Dashboard/HRDashboard'
import AccountCoordinatorDashboard from './components/Dashboard/AccountCoordinatorDashboard';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import NotFound from './pages/NotFound';
import { Routes, Route } from 'react-router-dom';
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard';
import ITDashboard from './components/Dashboard/ITDashboard';
import TeamLeaderDashboard from './components/Dashboard/TeamLeaderDashboard';
import  EngineeringDashboard from './components/Dashboard/EngineeringDashboard';
import  FacilitiesDashboard  from './components/Dashboard/FacilitiesDashboard';
import  OperationsDashboard  from './components/Dashboard/OperationsManagerDashboard';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />


            <Route element={<DashboardLayout />}>
              <Route path="/hr" element={<HRDashboard />} />
              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="/account" element={<AccountCoordinatorDashboard />} />
              <Route path='/admin' element={<SuperAdminDashboard />} />
              <Route path="/it" element={<ITDashboard />} />
              <Route path="/team-leader" element={<TeamLeaderDashboard />} />
              <Route path="/engineering" element={<EngineeringDashboard />} />
              <Route path="/facilities" element={<FacilitiesDashboard />} />
              <Route path="/operations" element={<OperationsDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

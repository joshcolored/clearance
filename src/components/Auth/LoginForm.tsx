import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [ntlogin, setNtlogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginType, setLoginType] = useState<'admin' | 'employee'>('admin');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || (loginType === 'admin' && !username) || (loginType === 'employee' && !ntlogin)) {
      setError('Please fill in all fields');
      return;
    }

    const identifier = loginType === 'employee' ? ntlogin : username;

    try {
      await login(identifier, password);
      // on success, AuthProvider will redirect based on role
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Clearance Admin Tracker
          </CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={loginType} onValueChange={(value) => setLoginType(value as 'admin' | 'employee')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Admin Login</TabsTrigger>
              <TabsTrigger value="employee">Employee Login</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <TabsContent value="admin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
              </TabsContent>

              <TabsContent value="employee" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ntlogin">NT Login</Label>
                  <Input
                    id="ntlogin"
                    type="text"
                    value={ntlogin}
                    onChange={(e) => setNtlogin(e.target.value)}
                    placeholder="Enter your NT login"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emp-password">Password</Label>
                  <Input
                    id="emp-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>
              </TabsContent>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Tabs>

          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-2">Demo Credentials:</p>
            <p className="text-gray-600 dark:text-gray-400">
              Admins: superadmin, hr, it, teamlead, engineering, facilities, account, operations
            </p>
            <p className="text-gray-600 dark:text-gray-400">Employees: Use NT login (e.g., jdoe)</p>
            <p className="text-gray-600 dark:text-gray-400">Password: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

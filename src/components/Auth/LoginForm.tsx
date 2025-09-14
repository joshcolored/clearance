import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export const LoginForm: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // can be username or NT login
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please fill in all fields')
      return;
    }

    try {
      await login(identifier, password);
      // The AuthContext should handle role-based redirect
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
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Username / NT Login</Label>
              <Input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your username or NT login"
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

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

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

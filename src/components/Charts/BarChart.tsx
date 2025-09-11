import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartData {
  name: string;
  completed: number;
  pending: number;
  total: number;
}

interface CustomBarChartProps {
  data: BarChartData[];
  title: string;
}

export const CustomBarChart: React.FC<CustomBarChartProps> = ({ data, title }) => {
  return (
    <div className="w-full h-80">
      <h3 className="text-lg font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-600" />
          <XAxis 
            dataKey="name" 
            className="dark:fill-gray-300"
            tick={{ fontSize: 12 }}
          />
          <YAxis className="dark:fill-gray-300" />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '6px'
            }}
          />
          <Legend />
          <Bar dataKey="completed" fill="#22c55e" name="Completed" />
          <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
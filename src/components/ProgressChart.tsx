
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mock progress data for different time periods
const progressData = [
  { period: '1 Day', scriptsMarked: 2500, percentage: 4.2 },
  { period: '7 Days', scriptsMarked: 15800, percentage: 26.7 },
  { period: '14 Days', scriptsMarked: 28900, percentage: 48.9 },
  { period: '21 Days', scriptsMarked: 42300, percentage: 71.6 },
  { period: '30 Days', scriptsMarked: 59100, percentage: 100 }
];

export const ProgressChart = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-blue-900">Marking Progress Over Time</CardTitle>
        <p className="text-sm text-gray-600">Cumulative scripts marked in the last 30 days</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'scriptsMarked' ? value.toLocaleString() + ' scripts' : value + '%',
                name === 'scriptsMarked' ? 'Scripts Marked' : 'Progress %'
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="scriptsMarked" 
              stroke="#1e3a8a" 
              strokeWidth={3}
              dot={{ fill: '#fbbf24', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

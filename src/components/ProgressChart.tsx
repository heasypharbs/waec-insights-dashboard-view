
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Mock progress data for different time periods with daily zigzag pattern
const generateProgressData = (days: number) => {
  const data = [];
  const totalScripts = 231019; // Sum from mock data
  
  for (let i = 1; i <= days; i++) {
    // Create zigzag pattern with overall upward trend
    const baseProgress = (i / days) * 100;
    const randomVariation = (Math.sin(i * 0.5) * 5) + (Math.random() * 8 - 4);
    const percentage = Math.max(0, Math.min(baseProgress + randomVariation, 100));
    const scriptsMarked = Math.round((percentage / 100) * totalScripts);
    
    data.push({
      day: `Day ${i}`,
      scriptsMarked,
      percentage: Number(percentage.toFixed(1))
    });
  }
  
  return data;
};

export const ProgressChart = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const progressData = generateProgressData(selectedPeriod);

  const periods = [
    { value: 7, label: '7 Days' },
    { value: 14, label: '14 Days' },
    { value: 21, label: '21 Days' },
    { value: 30, label: '30 Days' }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-900">Marking Progress Over Time</CardTitle>
            <p className="text-sm text-gray-600">Daily marking progress with zigzag pattern showing real-time fluctuations</p>
          </div>
          <div className="flex gap-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className={selectedPeriod === period.value ? "bg-blue-900 hover:bg-blue-800" : ""}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="day" 
              tick={{ fontSize: 12 }}
              interval={selectedPeriod > 14 ? 4 : 1}
            />
            <YAxis yAxisId="scripts" orientation="left" />
            <YAxis yAxisId="percentage" orientation="right" />
            <Tooltip 
              formatter={(value: any, name: string) => [
                name === 'scriptsMarked' ? value.toLocaleString() + ' scripts' : value + '%',
                name === 'scriptsMarked' ? 'Scripts Marked' : 'Progress %'
              ]}
            />
            <Line 
              yAxisId="scripts"
              type="monotone" 
              dataKey="scriptsMarked" 
              stroke="#1e3a8a" 
              strokeWidth={2}
              dot={{ fill: '#fbbf24', strokeWidth: 2, r: 3 }}
              name="scriptsMarked"
            />
            <Line 
              yAxisId="percentage"
              type="monotone" 
              dataKey="percentage" 
              stroke="#fbbf24" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#1e3a8a', strokeWidth: 2, r: 3 }}
              name="percentage"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

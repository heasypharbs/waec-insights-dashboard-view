
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExamRecord } from '../data/mockDashboardData';

interface ProgressChartProps {
  data: ExamRecord[];
}

export const ProgressChart = ({ data }: ProgressChartProps) => {
  const [sortBy, setSortBy] = useState<'allocated' | 'examiners' | 'reconciled'>('allocated');

  // Prepare data for subject comparison
  const chartData = data
    .map(item => ({
      subject: item.paperLongName.length > 20 
        ? item.paperLongName.substring(0, 20) + '...' 
        : item.paperLongName,
      fullName: item.paperLongName,
      allocated: item.totalAllocated,
      examiners: item.totalExaminers,
      reconciled: item.totalReconciled,
      paperCode: item.paperCode
    }))
    .sort((a, b) => b[sortBy] - a[sortBy]);

  const sortOptions = [
    { value: 'allocated', label: 'Scripts Allocated' },
    { value: 'examiners', label: 'Total Examiners' },
    { value: 'reconciled', label: 'Scripts Reconciled' }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-blue-900">Subject Performance Comparison</CardTitle>
            <p className="text-sm text-gray-600">Compare subjects by different metrics</p>
          </div>
          <div className="flex gap-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(option.value as 'allocated' | 'examiners' | 'reconciled')}
                className={sortBy === option.value ? "bg-blue-900 hover:bg-blue-800" : ""}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div style={{ width: Math.max(800, chartData.length * 60) }}>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [
                    value.toLocaleString(),
                    sortBy === 'allocated' ? 'Scripts Allocated' :
                    sortBy === 'examiners' ? 'Total Examiners' : 'Scripts Reconciled'
                  ]}
                  labelFormatter={(label) => {
                    const item = chartData.find(d => d.subject === label);
                    return item?.fullName || label;
                  }}
                />
                <Bar 
                  dataKey={sortBy}
                  fill={sortBy === 'allocated' ? '#1e3a8a' : sortBy === 'examiners' ? '#fbbf24' : '#10b981'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Chart shows:</strong> {
              sortBy === 'allocated' ? 'Number of scripts allocated per subject' :
              sortBy === 'examiners' ? 'Number of examiners per subject' : 
              'Number of scripts reconciled per subject'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

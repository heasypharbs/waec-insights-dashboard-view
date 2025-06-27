
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExamRecord } from '../data/mockDashboardData';

interface SubjectChartProps {
  data: ExamRecord[];
}

const COLORS = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#eff6ff'];

export const SubjectChart = ({ data }: SubjectChartProps) => {
  // Prepare data for bar chart - top 10 subjects by allocation
  const barChartData = data
    .sort((a, b) => b.totalAllocated - a.totalAllocated)
    .slice(0, 10)
    .map(item => ({
      name: item.paperLongName.substring(0, 15) + '...',
      allocated: item.totalAllocated,
      examiners: item.totalExaminers,
      fullName: item.paperLongName
    }));

  // Prepare data for pie chart - subject categories
  const pieChartData = [
    { name: 'Languages', value: data.filter(d => d.paperCode.startsWith('3')).length, color: '#1e3a8a' },
    { name: 'Sciences', value: data.filter(d => d.paperCode.startsWith('5')).length, color: '#3b82f6' },
    { name: 'Social Studies', value: data.filter(d => d.paperCode.startsWith('2')).length, color: '#60a5fa' },
    { name: 'Mathematics', value: data.filter(d => d.paperCode.startsWith('4')).length, color: '#93c5fd' },
    { name: 'Technical', value: data.filter(d => d.paperCode.startsWith('6')).length, color: '#dbeafe' },
    { name: 'Others', value: data.filter(d => !['2','3','4','5','6'].includes(d.paperCode[0])).length, color: '#eff6ff' }
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Top Subjects by Script Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  value.toLocaleString(), 
                  name === 'allocated' ? 'Scripts Allocated' : 'Examiners'
                ]}
                labelFormatter={(label) => {
                  const item = barChartData.find(d => d.name === label);
                  return item?.fullName || label;
                }}
              />
              <Bar dataKey="allocated" fill="#1e3a8a" name="allocated" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-blue-900">Subject Categories Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

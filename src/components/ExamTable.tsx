
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download } from 'lucide-react';
import { ExamRecord } from '../data/mockDashboardData';

interface ExamTableProps {
  data: ExamRecord[];
}

export const ExamTable = ({ data }: ExamTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ExamRecord>('totalAllocated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof ExamRecord) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredData = data
    .filter(item => 
      item.paperLongName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.paperCode.includes(searchTerm)
    )
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier;
      }
      return (Number(aVal) - Number(bVal)) * modifier;
    });

  const getProgressPercentage = (allocated: number, examiners: number) => {
    return examiners > 0 ? Math.min((allocated / (examiners * 50)) * 100, 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-900">Detailed Subject Report</CardTitle>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-3 font-semibold text-gray-700">
                  <button onClick={() => handleSort('paperCode')} className="hover:text-blue-900">
                    Paper Code {sortField === 'paperCode' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  <button onClick={() => handleSort('paperLongName')} className="hover:text-blue-900">
                    Subject {sortField === 'paperLongName' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  <button onClick={() => handleSort('totalExaminers')} className="hover:text-blue-900">
                    Examiners {sortField === 'totalExaminers' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">
                  <button onClick={() => handleSort('totalAllocated')} className="hover:text-blue-900">
                    Scripts Allocated {sortField === 'totalAllocated' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">Scripts/Examiner</th>
                <th className="text-left p-3 font-semibold text-gray-700">Progress</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const scriptsPerExaminer = item.totalExaminers > 0 ? Math.round(item.totalAllocated / item.totalExaminers) : 0;
                const progress = getProgressPercentage(item.totalAllocated, item.totalExaminers);
                
                return (
                  <tr key={item.paperCode} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-3 font-mono text-sm text-blue-700">{item.paperCode}</td>
                    <td className="p-3 font-medium">{item.paperLongName}</td>
                    <td className="p-3">{item.totalExaminers.toLocaleString()}</td>
                    <td className="p-3 font-semibold">{item.totalAllocated.toLocaleString()}</td>
                    <td className="p-3">{scriptsPerExaminer}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-900 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{progress.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredData.length} of {data.length} subjects
        </div>
      </CardContent>
    </Card>
  );
};

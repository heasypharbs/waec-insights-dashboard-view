
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, FileText, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import { ExamRecord } from '../data/mockDashboardData';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ExamTableProps {
  data: ExamRecord[];
}

export const ExamTable = ({ data }: ExamTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof ExamRecord>('totalAllocated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof ExamRecord) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getProgressPercentage = (allocated: number, reconciled: number) => {
    return allocated > 0 ? (reconciled / allocated) * 100 : 0;
  };

  const exportToCSV = () => {
    const headers = ['Paper Code', 'Subject', 'Marking Zone', 'Venue Code', 'Venue Name', 'Examiners', 'Scripts Allocated', 'Scripts Reconciled', 'Scripts/Examiner', 'Completion Rate'];
    const csvData = filteredData.map(item => [
      item.paperCode,
      item.paperLongName,
      item.markingZoneCode,
      item.mvCode,
      item.mvName,
      item.totalExaminers,
      item.totalAllocated,
      item.totalReconciled,
      item.totalExaminers > 0 ? Math.round(item.totalAllocated / item.totalExaminers) : 0,
      `${getProgressPercentage(item.totalAllocated, item.totalReconciled).toFixed(1)}%`
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waec-marking-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
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
                placeholder="Search subjects or codes..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
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
                <th className="text-left p-3 font-semibold text-gray-700">Marking Zone</th>
                <th className="text-left p-3 font-semibold text-gray-700">Venue Info</th>
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
                <th className="text-left p-3 font-semibold text-gray-700">
                  <button onClick={() => handleSort('totalReconciled')} className="hover:text-blue-900">
                    Scripts Reconciled {sortField === 'totalReconciled' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th className="text-left p-3 font-semibold text-gray-700">Scripts/Examiner</th>
                <th className="text-left p-3 font-semibold text-gray-700">Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => {
                const scriptsPerExaminer = item.totalExaminers > 0 ? Math.round(item.totalAllocated / item.totalExaminers) : 0;
                const completionRate = getProgressPercentage(item.totalAllocated, item.totalReconciled);
                
                return (
                  <tr key={item.paperCode} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-3 font-mono text-sm text-blue-700">{item.paperCode}</td>
                    <td className="p-3 font-medium max-w-xs">
                      <div className="truncate" title={item.paperLongName}>
                        {item.paperLongName}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {item.markingZoneCode}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-sm">
                        <div className="font-medium">Code: {item.mvCode}</div>
                        <div className="text-gray-600 text-xs truncate max-w-32" title={item.mvName}>
                          {item.mvName}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-center">{item.totalExaminers.toLocaleString()}</td>
                    <td className="p-3 text-center font-semibold">{item.totalAllocated.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-1 rounded text-sm ${item.totalReconciled > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.totalReconciled.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-3 text-center">{scriptsPerExaminer}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${completionRate > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}
                            style={{ width: `${Math.min(completionRate, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 min-w-12">{completionRate.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} subjects
          </div>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <PaginationItem key={page}>...</PaginationItem>;
                  }
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

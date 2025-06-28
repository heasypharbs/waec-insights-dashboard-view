
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [sortField, setSortField] = useState<keyof ExamRecord>('totalAllocated');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const handleSort = (field: keyof ExamRecord) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  // Remove duplicates and sort the data
  const processedData = data
    .filter((item, index, self) => 
      index === self.findIndex(t => 
        t.paperCode === item.paperCode && t.mvCode === item.mvCode
      )
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

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);

  const getProgressPercentage = (allocated: number, reconciled: number) => {
    return allocated > 0 ? (reconciled / allocated) * 100 : 0;
  };

  // Function to get full paper name with paper number
  const getFullPaperName = (paperCode: string, paperLongName: string) => {
    // Extract paper number from paper code (e.g., "ENG2" -> "Paper 2")
    const paperMatch = paperCode.match(/(\d+)$/);
    const paperNumber = paperMatch ? paperMatch[1] : '';
    
    if (paperNumber) {
      return `${paperLongName} (Paper ${paperNumber})`;
    }
    return paperLongName;
  };

  const exportToCSV = () => {
    const headers = ['Paper Code', 'Subject', 'Marking Zone', 'Venue Code', 'Venue Name', 'Examiners', 'Scripts Allocated', 'Scripts Reconciled', 'Scripts/Examiner', 'Completion Rate'];
    
    // Export ALL processed data (not just current page)
    const csvData = processedData.map(item => [
      item.paperCode,
      getFullPaperName(item.paperCode, item.paperLongName),
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

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `waec-detailed-subject-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log(`Exported ${processedData.length} records to CSV`);
  };

  const handlePrint = () => {
    // Create a new window with all the processed data for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>WAEC Detailed Subject Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .progress-bar { width: 50px; height: 10px; background-color: #e0e0e0; position: relative; }
            .progress-fill { height: 100%; background-color: #4CAF50; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>WAEC Detailed Subject Report</h1>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <p>Total Records: ${processedData.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Paper Code</th>
                <th>Subject</th>
                <th>Marking Zone</th>
                <th>Venue Code</th>
                <th>Venue Name</th>
                <th>Examiners</th>
                <th>Scripts Allocated</th>
                <th>Scripts Reconciled</th>
                <th>Scripts/Examiner</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              ${processedData.map(item => {
                const scriptsPerExaminer = item.totalExaminers > 0 ? Math.round(item.totalAllocated / item.totalExaminers) : 0;
                const completionRate = getProgressPercentage(item.totalAllocated, item.totalReconciled);
                return `
                  <tr>
                    <td>${item.paperCode}</td>
                    <td>${getFullPaperName(item.paperCode, item.paperLongName)}</td>
                    <td>${item.markingZoneCode}</td>
                    <td>${item.mvCode}</td>
                    <td>${item.mvName}</td>
                    <td>${item.totalExaminers.toLocaleString()}</td>
                    <td>${item.totalAllocated.toLocaleString()}</td>
                    <td>${item.totalReconciled.toLocaleString()}</td>
                    <td>${scriptsPerExaminer}</td>
                    <td>${completionRate.toFixed(1)}%</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-900">Detailed Subject Report</CardTitle>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <FileText className="h-4 w-4 mr-2" />
              Export CSV ({processedData.length} records)
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print All ({processedData.length} records)
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
                  <tr key={`${item.paperCode}-${item.mvCode}`} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-3 font-mono text-sm text-blue-700">{item.paperCode}</td>
                    <td className="p-3 font-medium max-w-xs">
                      <div className="truncate" title={getFullPaperName(item.paperCode, item.paperLongName)}>
                        {getFullPaperName(item.paperCode, item.paperLongName)}
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
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, processedData.length)} of {processedData.length} subjects
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

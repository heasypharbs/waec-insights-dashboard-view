
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, FileText, Calculator, TrendingUp, BookOpen, Target } from 'lucide-react';
import { dashboardService } from '../services/dashboardService';
import { DashboardHeader } from './DashboardHeader';
import { MetricCard } from './MetricCard';
import { SubjectChart } from './SubjectChart';
import { ProgressChart } from './ProgressChart';
import { ExamTable } from './ExamTable';
import { MarkingVenueFilter } from './MarkingVenueFilter';
import { ExamRecord } from '../data/mockDashboardData';

export const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedVenue, setSelectedVenue] = useState<string>('all');

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['markingVenueReport', refreshKey],
    queryFn: dashboardService.fetchMarkingVenueReport,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const allExamData = dashboardData?.returnData || [];
  
  // Filter data based on selected venue
  const examData = selectedVenue === 'all' 
    ? allExamData 
    : allExamData.filter(item => item.mvCode.toString() === selectedVenue);

  // Calculate summary metrics
  const totalSubjects = examData.length;
  const totalExaminers = examData.reduce((sum, item) => sum + item.totalExaminers, 0);
  const totalScriptsAllocated = examData.reduce((sum, item) => sum + item.totalAllocated, 0);
  const totalReconciled = examData.reduce((sum, item) => sum + item.totalReconciled, 0);
  const averageScriptsPerExaminer = totalExaminers > 0 ? Math.round(totalScriptsAllocated / totalExaminers) : 0;
  const completionRate = totalScriptsAllocated > 0 ? (totalReconciled / totalScriptsAllocated) * 100 : 0;

  // Get venue statistics
  const totalVenues = Array.from(new Set(allExamData.map(item => item.mvCode))).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading WAEC Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">Error loading dashboard data</p>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader totalVenues={totalVenues} />
        
        {/* Marking Venue Filter */}
        <MarkingVenueFilter 
          data={allExamData}
          selectedVenue={selectedVenue}
          onVenueChange={setSelectedVenue}
        />
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Total Subjects"
            value={totalSubjects}
            icon={BookOpen}
            color="bg-blue-900"
            trend={{ value: 5.2, isPositive: true }}
          />
          <MetricCard
            title="Total Examiners"
            value={totalExaminers}
            icon={Users}
            color="bg-blue-700"
            trend={{ value: 2.1, isPositive: true }}
          />
          <MetricCard
            title="Scripts Allocated"
            value={totalScriptsAllocated}
            icon={FileText}
            color="bg-blue-600"
            trend={{ value: 8.3, isPositive: true }}
          />
          <MetricCard
            title="Scripts Reconciled"
            value={totalReconciled}
            icon={Target}
            color="bg-yellow-500"
            trend={{ value: 0, isPositive: true }}
          />
          <MetricCard
            title="Avg Scripts/Examiner"
            value={averageScriptsPerExaminer}
            icon={Calculator}
            color="bg-blue-800"
            trend={{ value: 1.5, isPositive: false }}
          />
          <MetricCard
            title="Completion Rate"
            value={`${completionRate.toFixed(1)}%`}
            icon={TrendingUp}
            color="bg-yellow-600"
            trend={{ value: 0, isPositive: true }}
          />
        </div>

        {/* Subject Comparison Chart */}
        <ProgressChart data={examData} />

        {/* Subject Distribution Charts */}
        <SubjectChart data={examData} />

        {/* Detailed Table with Pagination */}
        <ExamTable data={examData} />

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>WAEC Marking Venue Dashboard • Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-1">
            Showing {selectedVenue === 'all' ? 'all venues' : 'selected venue'} • 
            Data refreshes automatically every 30 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

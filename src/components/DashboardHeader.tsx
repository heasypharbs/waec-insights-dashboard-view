
import { Clock, MapPin } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">WAEC Marking Venue Dashboard</h1>
          <p className="text-green-100 text-lg">Examination Marking Progress Report</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-green-100 mb-2">
            <MapPin className="h-4 w-4" />
            <span>Lagos Zone (800)</span>
          </div>
          <div className="flex items-center gap-2 text-green-100">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


import { Clock, MapPin } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/waec-logo.png" 
            alt="WAEC Logo - West African Examinations Council"
            className="h-16 w-16 object-contain"
            onError={(e) => {
              // Hide image if not found
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">WAEC Marking Venue Dashboard</h1>
            <p className="text-blue-100 text-lg">Examination Marking Progress Report</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-blue-100 mb-2">
            <MapPin className="h-4 w-4" />
            <span>Lagos Zone (800)</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

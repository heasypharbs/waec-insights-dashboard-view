
import { Clock, MapPin, Building } from 'lucide-react';

interface DashboardHeaderProps {
  totalVenues?: number;
  selectedVenue?: string;
  venueName?: string;
}

export const DashboardHeader = ({ totalVenues, selectedVenue, venueName }: DashboardHeaderProps) => {
  const isAllVenues = selectedVenue === 'all';
  const headerTitle = isAllVenues ? 'WAEC Marking Dashboard' : `WAEC Marking Dashboard - ${venueName}`;
  const subTitle = isAllVenues ? 'All Centers Performance Report' : `Center Performance Report`;

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/3ec03708-fb4f-4afa-bd0f-f41affa90f22.png" 
            alt="WAEC Logo - West African Examinations Council"
            className="h-16 w-16 object-contain"
            onError={(e) => {
              // Hide image if not found
              e.currentTarget.style.display = 'none';
            }}
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{headerTitle}</h1>
            <p className="text-blue-100 text-lg">{subTitle}</p>
          </div>
        </div>
        <div className="text-right">
          {totalVenues && (
            <div className="flex items-center gap-2 text-blue-100 mb-2">
              <Building className="h-4 w-4" />
              <span>{isAllVenues ? `${totalVenues} Marking Venues` : '1 Venue Selected'}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-blue-100 mb-2">
            <MapPin className="h-4 w-4" />
            <span>{isAllVenues ? 'Nigeria-wide Coverage' : venueName}</span>
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

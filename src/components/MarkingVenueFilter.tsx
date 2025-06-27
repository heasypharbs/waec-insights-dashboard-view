
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Building, Target } from 'lucide-react';
import { ExamRecord } from '../data/mockDashboardData';

interface MarkingVenueFilterProps {
  data: ExamRecord[];
  selectedVenue: string;
  onVenueChange: (venue: string) => void;
}

export const MarkingVenueFilter = ({ data, selectedVenue, onVenueChange }: MarkingVenueFilterProps) => {
  // Extract unique marking venues from data
  const venues = Array.from(new Map(data.map(item => [
    `${item.mvCode}`,
    {
      code: item.mvCode,
      name: item.mvName,
      zoneCode: item.markingZoneCode,
      fullIdentifier: `${item.mvName} (${item.mvCode})`
    }
  ])).values());

  const currentVenue = venues.find(v => v.code.toString() === selectedVenue);

  return (
    <Card className="mb-6 border-l-4 border-yellow-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-900" />
              <div>
                <p className="text-sm text-gray-600">Current Marking Venue</p>
                <p className="font-semibold text-gray-900">
                  {currentVenue ? currentVenue.name : 'All Venues'}
                </p>
              </div>
            </div>
            {currentVenue && (
              <>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-900" />
                  <div>
                    <p className="text-sm text-gray-600">Venue Code</p>
                    <p className="font-semibold text-gray-900">{currentVenue.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-900" />
                  <div>
                    <p className="text-sm text-gray-600">Marking Zone</p>
                    <p className="font-semibold text-gray-900">{currentVenue.zoneCode}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="min-w-[300px]">
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Filter by Marking Venue
            </label>
            <Select value={selectedVenue} onValueChange={onVenueChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select marking venue..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Marking Venues</SelectItem>
                {venues.map((venue) => (
                  <SelectItem key={venue.code} value={venue.code.toString()}>
                    {venue.fullIdentifier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

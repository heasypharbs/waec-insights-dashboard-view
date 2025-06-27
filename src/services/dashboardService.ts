
import { mockDashboardData, DashboardResponse } from '../data/mockDashboardData';

export const dashboardService = {
  async fetchMarkingVenueReport(): Promise<DashboardResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would be:
    // const response = await fetch('https://www.waec.org.ng/marking-venue-report');
    // return response.json();
    
    return mockDashboardData;
  }
};

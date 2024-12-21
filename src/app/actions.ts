"use server"
import { StartupTableProps } from '@/components/dashboard/StartupTable';
import { Startup } from '@/components/dashboard/StartupCard';


export async function fetchStartups(): Promise<StartupTableProps> {
    try {
        const response = await fetch(
            'https://startupilot.cloud.strixthekiet.me/api/startups/'
        );
        const data = await response.json();
    
        const startups = data.results.map((item: any) => ({
        id: item.id || '',
        name: item.name || 'Unnamed Startup',
        short_description: item.short_description || '',
        long_description: item.description || '',
        avatar: item.avatar || '/dummy_logo/default.png',
        category: item.category || 'Uncategorized',
        status: item.status || 'Inactive',
        priority: item.priority || 'P3',
        phase: item.phases[0] || 'Peer Mentor',
        batch: item.batch || 'AY 24-25',
        email: item.email || '',
        linkedin: item.linkedin || '',
        facebook: item.facebook || '',
        pitchdeck: item.pitchdeck || '',
        }));
        return { startups };
    } catch (error) {
        throw new Error('Error fetching startups');
    }
};

export async function fetchStartupWithFilters(filters: any): Promise<StartupTableProps> {
    try {
        const response = await fetch(
            `https://startupilot.cloud.strixthekiet.me/api/startups/?${filters}`
        );
        const data = await response.json();
        console.log("Filters: ", filters);
        
        const startups = data.results.map((item: any) => ({
            id: item.id || '',
            name: item.name || 'Unnamed Startup',
            short_description: item.short_description || '',
            long_description: item.description || '',
            avatar: item.avatar || '/dummy_logo/default.png',
            category: item.category || 'Uncategorized',
            status: item.status || 'Inactive',
            priority: item.priority || 'P3',
            phase: item.phases[0] || 'Peer Mentor',
            batch: item.batch || 'AY 24-25',
            email: item.email || '',
            linkedin: item.linkedin || '',
            facebook: item.facebook || '',
            pitchdeck: item.pitchdeck || '',
        }));
        
        return { startups };
    } catch (error) {
        throw new Error('Error fetching filtered startups');
    }
}

export async function fetchStartupById(id: string): Promise<Startup> {
    try {
      const response = await fetch(`https://startupilot.cloud.strixthekiet.me/api/startups/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
  
      const data = await response.json();
  
      // Map the data to your desired structure if necessary
      const startup: Startup = {
        id: data.id || '',
        name: data.name || 'Unnamed Startup',
        short_description: data.short_description || '',
        long_description: data.description || '',
        email: data.email || '',
        category: data.category || 'Uncategorized',
        linkedin_url: data.linkedin_url || '',
        facebook_url: data.facebook_url || '',
        phases: data.phases || [],
        status: data.status || 'Inactive',
        priority: data.priority || 'P3',
        batch: data.batch || 'AY 24-25',
        pitch_deck: data.pitch_deck || '',
        avatar: data.avatar || '/dummy_logo/default.png',
        memberships: data.memberships || [],
        advisors: data.advisors || [],
        notes: data.notes || [],
      };
  
      return startup;
    } catch (error) {
      throw new Error(`Error fetching startup by ID: ${error}`);
    }
  }
  
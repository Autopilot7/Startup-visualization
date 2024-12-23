"use server"
import { StartupTableProps } from '@/components/dashboard/StartupTable';
import { Startup } from '@/components/dashboard/StartupCard';
import { endpoints } from './utils/apis';

interface StartupResponse {
  startups: StartupTableProps["startups"];
  next: string | null;
}

export async function fetchStartups(): Promise<StartupResponse> {
    try {
        const response = await fetch(
            `${endpoints.startups}`
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
        return { 
            startups,
            next: data.next 
        };
    } catch (error) {
        throw new Error('Error fetching startups');
    }
};

export async function fetchStartupWithFilters(filters: any): Promise<StartupResponse> {
    try {
        const response = await fetch(
            `${endpoints.startups}?${filters}`
        );
        const data = await response.json();
        console.log("Fetch startups with filters: ", filters);
        
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
        
        return { 
            startups,
            next: data.next 
        };
    } catch (error) {
        throw new Error('Error fetching filtered startups');
    }
}

export async function fetchStartupById(id: string): Promise<Startup> {
    try {
      const response = await fetch(`${endpoints.startups}${id}`);
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
        location: data.location || [],
      };
  
      return startup;
    } catch (error) {
      throw new Error(`Error fetching startup by ID: ${error}`);
    }
  }
  

// actions.ts (or wherever you keep your server actions)
export interface Member {
    id: string;
    name: string;
    email?: string;
    shorthand?: string;
    phone?: string;
    linkedin_url?: string;
    facebook_url?: string;
    avatar?: string;
    memberships?: any[];
    notes?: any[];
  }
  
  export async function fetchMemberById(id: string): Promise<Member> {
    try {
      const response = await fetch(`${endpoints.members}${id}`);
      if (!response.ok) {
        throw new Error('Network response was not OK');
      }
  
      const data = await response.json();
  
      // Map the data to your desired structure if necessary
      const member: Member = {
        id: data.id || '',
        name: data.name || 'Unknown Member',
        email: data.email || '',
        shorthand: data.shorthand || '',
        phone: data.phone || '',
        linkedin_url: data.linkedin_url || '',
        facebook_url: data.facebook_url || '',
        avatar: data.avatar || 'https://via.placeholder.com/100',
        memberships: data.memberships || [],
        notes: data.notes || [],
      };
  
      return member;
    } catch (error) {
      throw new Error(`Error fetching member by ID: ${error}`);
    }
  }

  
// app/actions/fetchAllMembers.ts
export interface Members {
    id: string;
    name: string;
    email?: string;
    shorthand?: string;
    phone?: string;
    linkedin_url?: string;
    facebook_url?: string;
    avatar?: string;
    // any other fields (memberships, notes, etc.)
  }
  
  export async function fetchAllMembers(): Promise<Members[]> {
    try {
      const response = await fetch(`${endpoints.members}`, {
        // next: { revalidate: 60 } // if you want revalidation caching
      });
      if (!response.ok) {
        throw new Error(`Network response was not OK. Status: ${response.status}`);
      }
  
      // This should be an array of members (the JSON you posted above)
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Error fetching all members: ${error}`);
    }
  }


 export interface Mentor{
    startups: {
        id: string;
        name: string;
    };
 }

 export interface Advisors{
    mentorships: never[];
    id: string;
    name: string;
    email?: string;
    phone?: string;
    linkedin_url?: string;
    facebook_url?: string;
    area_of_expertise?: string;
    avatar?: string;
    mentorship?: Mentor[];
 }
 
 export async function fetchAllAdvisors(): Promise<Members[]> {
    try {
      const response = await fetch(`${endpoints.advisors}`, {
        // next: { revalidate: 60 } // if you want revalidation caching
      });
      if (!response.ok) {
        throw new Error(`Network response was not OK. Status: ${response.status}`);
      }
  
      // This should be an array of members (the JSON you posted above)
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Error fetching all members: ${error}`);
    }
  }

export async function fetchAdvisorById(id: string): Promise<Advisors> {
  try {
    const response = await fetch(`${endpoints.advisors}${id}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }

    const data = await response.json();

    const advisor: Advisors = {
        id: data.id || '',
        name: data.name || 'Unknown Advisor',
        email: data.email || '',
        phone: data.phone || '',
        linkedin_url: data.linkedin_url || '',
        facebook_url: data.facebook_url || '',
        area_of_expertise: data.area_of_expertise || '',
        avatar: data.avatar || 'https://via.placeholder.com/100',
        mentorships: data.mentorships || [],
    };

    return advisor;
  } catch (error) {
    throw new Error(`Error fetching advisor by ID: ${error}`);
  }
}

export async function fetchStartupsForVisualization(): Promise<any> {
  try {
    const response = await fetch('https://startupilot.cloud.strixthekiet.me/api/startups/analytics');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (err) {
    throw new Error(`Failed to fetch data, using dummy data instead: ${err}`);
  }
}

export async function exportStartups(columns: string[], filters: string, exportAll: boolean): Promise<{
  ok: boolean;
  status: number;
  data: ArrayBuffer;
}> {
  let apiEndpoint = 'https://startupilot.cloud.strixthekiet.me/api/startups/export';
  
  console.log("Exporting columns:", columns);
  
  try {
    let finalUrl = apiEndpoint;
    
    if (!exportAll) {
      if (filters.length > 0 && columns.length > 0 && !columns.includes("all")) {
        finalUrl = `${apiEndpoint}?${filters}&columns=name,${columns.join(',')}`;
      }
      else if (filters.length > 0) {
        finalUrl = `${apiEndpoint}?${filters}`;
      }
      else if (columns.length > 0 && !columns.includes("all")) {
        finalUrl = `${apiEndpoint}?columns=name,${columns.join(',')}`;
      }
    }
    else if (columns.length > 0 && !columns.includes("all")) {
      finalUrl = `${apiEndpoint}?columns=name,${columns.join(',')}`;
    }
    
    console.log("API Endpoint: ", finalUrl);
    const response = await fetch(finalUrl);
    
    if (!response.ok) {
      throw new Error(`Export failed with status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    
    return {
      ok: response.ok,
      status: response.status,
      data: arrayBuffer
    };
  } catch (err) {
    throw new Error(`Failed to export startups: ${err}`);
  }
}

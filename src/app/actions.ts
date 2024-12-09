"use server"
import { StartupTableProps } from '@/components/dashboard/StartupTable';

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
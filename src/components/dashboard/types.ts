export interface UserProfile {
    name: string;
    location: string;
    avatar: string;
  }
  
  export interface TeamMember {
    name: string;
    avatar: string;
  }
  
  export interface StartupCardProps {
    name: string;
    description: string;
    logo: string;
    field: string;
    status: 'Active' | 'Inactive';
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    phase: 'Ideation' | 'Incubation' | 'Acceleration';
    launch_date: 'AY 2021-2022' | 'AY 2022-2023' | 'AY 2023-2024'
  }
  
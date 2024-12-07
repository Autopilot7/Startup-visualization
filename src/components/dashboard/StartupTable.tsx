// components/StartupTable.tsx
import StartupCard, { StartupCardProps } from '@/components/dashboard/StartupCard';
import React, { useEffect, useState } from 'react';

type StartupTableProps = {
  startups: StartupCardProps[];
};


export const fetchStartups = async (): Promise<StartupTableProps> => {
  try {
    const response = await fetch(
      'https://startupilot.cloud.strixthekiet.me/api/startups/'
    );
    const data = await response.json();

    // Map API results to match the expected StartupTableProps structure
    const startups = data.results.map((item: any) => ({
      id: item.id || '', // Use API's id
      name: item.name || 'Unnamed Startup',
      short_description: item.short_description || '',
      long_description: item.description || '',
      avatar: item.avatar || '/dummy_logo/default.png', // Default avatar if none
      category: item.category || 'Uncategorized',
      status: item.status || 'Inactive',
      priority: item.priority || 'P3', // Default priority
      phase: item.phases?.[0] || 'Idea', // Use the first phase, if available
      batch: item.batch || 'Unknown',
      email: item.email || '',
      linkedin: '', // Placeholder for LinkedIn
      facebook: '', // Placeholder for Facebook
      pitchdeck: '', // Placeholder for Pitch Deck
    }));

    return { startups };
  } catch (error) {
    console.error('Error fetching startups:', error);
    return { startups: [] }; // Return an empty list on error
  }
};

export default function StartupTable({ startups }: StartupTableProps) {
  const [startupTableProps, setStartupTableProps] = useState<StartupTableProps | null>(null);
  
  useEffect(() => {
    const loadStartups = async () => {
      const data = await fetchStartups();
      setStartupTableProps(data);
    };

    loadStartups();
  }, []);

  if (!startupTableProps) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-lg:space-y-4 lg:grid lg:grid-cols-2 md:gap-4">
      {startupTableProps.startups.map((startup) => (
      <StartupCard
        key={startup.id}
        name={startup.name}
        short_description={startup.short_description}
        long_description={startup.long_description}
        avatar={startup.avatar}
        category={startup.category}
        status={startup.status}
        priority={startup.priority}
        phase={startup.phase}
        batch={startup.batch}
        id={startup.id}
        email={startup.email}
        linkedin={startup.linkedin}
        facebook={startup.facebook}
        pitchdeck={startup.pitchdeck}
      />
      ))}
    </div>
  );
}

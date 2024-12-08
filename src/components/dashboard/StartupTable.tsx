// components/StartupTable.tsx
import StartupCard, { StartupCardProps } from '@/components/dashboard/StartupCard';
import React from 'react';

export type StartupTableProps = {
  startups: StartupCardProps[];
};

export default function StartupTable({ startups }: StartupTableProps) {
  return (
    <div className="gap-4 xl:grid xl:grid-cols-2 max-xl:space-y-4">
      {startups.map((startup) => (
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

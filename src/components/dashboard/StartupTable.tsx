// components/StartupTable.tsx
import StartupCard, { StartupCardProps, dummyStartupCardProps } from '@/components/dashboard/StartupCard';

type StartupTableProps = {
  startups: StartupCardProps[];
};

export const dummyStartupTableProps: StartupTableProps = {
  startups: Array(12).fill(dummyStartupCardProps)
};

export default function StartupTable({ startups }: StartupTableProps) {
  return (
    <div className="space-y-4">
      {startups.map((startup, index) => (
        <StartupCard key={index} {...startup} />
      ))}
    </div>
  );
}

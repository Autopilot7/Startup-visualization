// app/startupinfo/[id]/page.tsx

// No 'use client' directive here so this is a server component by default
import StartupInfo from "@/components/Startupinfo";
import { fetchStartups } from "../../actions";
import { StartupTableProps } from "@/components/dashboard/StartupTable";

export default async function StartupInfoPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await fetchStartups();
  const startup = data.startups.find((s) => s.id.toString() === id);

  if (!startup) {
    return <div>No startup found for ID: {id}</div>;
  }

  return (
    <div className="center">
      <StartupInfo
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
    </div>
  );
}

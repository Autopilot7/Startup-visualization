// app/startupinfo/[id]/page.tsx

// No 'use client' directive here so this is a server component by default
import StartupInfo from "@/components/Startupinfo";
import { fetchStartups } from "../../actions";
import { fetchStartupById } from "../../actions";
import { StartupTableProps } from "@/components/dashboard/StartupTable";


export default async function StartupInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await fetchStartupById(id);
  const startup = data;

  if (!startup) {
    return <div>No startup found for ID: {id}</div>;
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    }}>
      <StartupInfo
        id={startup.id}
        name={startup.name}
        short_description={startup.short_description}
        long_description={startup.long_description}
        avatar={startup.avatar}
        // category={startup.category}
        status={startup.status}
        priority={startup.priority}
        phases={startup.phases}
        batch={startup.batch}
        // email={startup.email}
        linkedin_url={startup.linkedin_url}
        // facebook_url={startup.facebook_url}
        notes={startup.notes}
        pitch_deck={startup.pitch_deck}
        // short_description={""} 
        email={""}
        category={""}
        facebook_url={""}
        memberships={startup.memberships}
        advisors={startup.advisors} 
        location={startup.location} />
    </div>
  );
}

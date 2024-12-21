"use client";
import StartupInfo from "@/components/Startupinfo";
import { useEffect, useState } from "react";
import { fetchStartups } from "../actions";
import { StartupTableProps } from "@/components/dashboard/StartupTable";

export default function Startupinfo() {
  const [startupData, setStartupData] = useState<StartupTableProps['startups']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStartups = async () => {
      try {
        const data = await fetchStartups();
        setStartupData(data.startups);
      } catch (error) {
        console.error("Error fetching startups:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadStartups();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="center">
        <div className=" flex flex-row justify-center">
          {startupData.map((startup)=> (
            <StartupInfo             
              key={startup.id}
              name={startup.name}
              short_description={startup.short_description}
              long_description={startup.long_description}
              avatar={startup.avatar}
              category={startup.category}
              status={startup.status}
              priority={startup.priority}
              phases={[startup.phase]}
              batch={startup.batch}
              id={startup.id}
              email={startup.email}
              linkedin_url={startup.linkedin}
              facebook_url={startup.facebook}
              pitch_deck={startup.pitchdeck} memberships={[]} advisors={[]} notes={[]}              />
          ))}
        </div>
    </div>
  )
}

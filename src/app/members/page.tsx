import { fetchAllAdvisors, fetchAllMembers } from "../actions"; // Adjust to your actual path
import MemberCard from "@/components/Membercard"; // or wherever your MemberCard is located
import AdvisorCard from "@/components/Advisorcard"; // or wherever your MemberCard is located
import { MemberManagement } from "@/components/memberform"; // Adjust to your actual path



export default async function MembersPage() {
  // Server Components can call server actions directly
  const allMembers = await fetchAllMembers();
  const allAdvisors = await fetchAllAdvisors();

  if (!allAdvisors || allAdvisors.length === 0) {
    return <div className="p-4">No advisors found.</div>;
  }

  // If no members found
  if (!allMembers || allMembers.length === 0) {
    return <div className="p-4">No members found.</div>;
  }

  return (
    <div>

    
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">All Members</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {allMembers.map((member) => (
          <MemberCard
            key={member.id}
            id={member.id}
            name={member.name}
            email={member.email}
            phone={member.phone}
            linkedin_url={member.linkedin_url}
            facebook_url={member.facebook_url}
            avatar={member.avatar}
            // If membership array is available, pass it
            // memberships={member.memberships}
          />
        ))}
        
        
      </div>
      
    </div>
    <div className="mx-auto max-w-4xl px-4 py-8">
    <h1 className="text-2xl font-bold mb-4">All Advisors</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {allAdvisors.map((advisor) => (
          <AdvisorCard
            key={advisor.id}
            id={advisor.id}
            name={advisor.name}
            avatar={advisor.avatar}
            // If membership array is available, pass it
            // memberships={member.memberships}
          />
        ))}
    </div>
    </div>
    </div>
  );
}

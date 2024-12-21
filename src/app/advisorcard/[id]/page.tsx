// app/memberinfo/[id]/page.tsx
import Advisorinfo from "@/components/Advisorinfo";
import { fetchAdvisorById } from "../../actions";  // or wherever your server action is located

export default async function AdvisorInfoPage({ params }: { params: Promise<{ id: string }> }) {
  // Extract the `id` from the route parameters
  const { id } = await params;

  // Fetch the member data from your server or database
  const member = await fetchAdvisorById(id);

  // Handle case where no member is found
  if (!member) {
    return <div>No advisor found for ID: {id}</div>;
  }

  // Render the MemberCard (or your custom MemberInfo component)
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Advisorinfo
        id={member.id}
        name={member.name}
        email={member.email}
        phone={member.phone}
        linkedin_url={member.linkedin_url}
        facebook_url={member.facebook_url}
        avatar={member.avatar}
        mentorship={member.mentorships}
      />
    </div>
  );
}

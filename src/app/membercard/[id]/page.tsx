// app/memberinfo/[id]/page.tsx

// This file is a Server Component by default (no 'use client' at the top).
import Memberinfo from "../../../components/Memberinfo";
import { fetchMemberById } from "../../actions";  // or wherever your server action is located

export default async function MemberInfoPage({ params }: { params: Promise<{ id: string }> }) {
  // Extract the `id` from the route parameters
  const { id } = await params;

  // Fetch the member data from your server or database
  const member = await fetchMemberById(id);

  // Handle case where no member is found
  if (!member) {
    return <div>No member found for ID: {id}</div>;
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
      <Memberinfo
        id={member.id}
        name={member.name}
        email={member.email}
        phone={member.phone}
        linkedin_url={member.linkedin_url}
        facebook_url={member.facebook_url}
        memberships={member.memberships}
        avatar={member.avatar}
        notes={member.notes}
      />
    </div>
  );
}

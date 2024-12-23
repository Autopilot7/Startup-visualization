"use client";

import { MemberForm } from "@/components/forms/MemberForm";
import { useRouter } from "next/navigation";

export default function CreateMemberPage() {
  const router = useRouter();

  return <MemberForm 
    onClose={() => router.back()} 
    onAddMember={(member) => {
      router.push('/members');
    }} 
  />;
}

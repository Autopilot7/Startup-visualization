"use client";

import { AdvisorForm } from "@/components/forms/AdvisorForm";
import { useRouter } from "next/navigation";

export default function CreateAdvisorPage() {
  const router = useRouter();

  return <AdvisorForm onClose={() => router.back()} onAddAdvisor={(advisor) => {
    // Handle advisor creation
    router.push('/advisors');
  }} />;
}
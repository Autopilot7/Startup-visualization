"use client"; // This will be a Client Component, as it may contain interactive UI

import Image from "next/image";
import Link from "next/link";

interface MemberCardProps {
  id: string;
  name: string;
  avatar?: string;
}

export default function AdvisorCard({
  id,
  name,
  avatar,
}: MemberCardProps) {
  return (
    <Link href={`/advisorcard/${id}`} className="block">
      <div className="flex gap-4 p-4 border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-150" style={{height: '120px' }}>
        <Image
          src={avatar || "https://via.placeholder.com/100"}
          width={80}
          height={80}
          className="rounded-full object-cover"
          alt={`${name}'s avatar`}
        />

        <div className="flex flex-col justify-center">
          <p className="text-lg font-semibold">{name}</p>
        </div>
      </div>
    </Link>
  );
}

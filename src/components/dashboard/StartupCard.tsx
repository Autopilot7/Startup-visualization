// components/StartupCard.tsx
'use client';

import Badge from '@/components/dashboard/Badge';
import Image from 'next/image';
import Link from 'next/link';

export interface StartupCardProps {
  name: string;
  short_description: string;
  long_description: string;
  avatar: string;
  linkedin:string;
  facebook:string;
  category: string;
  status: "Active" | "Inactive";
  priority: "P0" | "P1" | "P2";
  phase: "Peer Mentor" | "EIR Support" | "Incubation";
  batch: string;
  pitchdeck: string;
  id: string;
  email: string;
};

export default function StartupCard({
  name,
  short_description,
  long_description,
  avatar,
  category,
  status,
  priority,
  phase,
  batch,
  id,
}: StartupCardProps) {
  return (
    <Link href={`/startupinfo/${id}`} className="block w-full">
      <button className="flex w-full h-[120px] sm:h-[160px] md:h-[180px] gap-4 rounded-2xl border border-slate-400 bg-white p-2 hover:bg-gray-100 transition-colors duration-200 md:flex-row items-center md:p-4 overflow-hidden">
        <Image
          src={avatar}
          width={100}
          height={100}
          className="flex-shrink-0 max-md:mx-auto h-20 w-20 object-cover rounded-full md:mx-0 md:h-24 md:w-24"
          alt={`${name} Logo`} 
        />
        <div className="space-y-2 text-left max-md:space-y-2 min-w-0 flex-1">
          <div className="flex md:flex-row overflow-hidden">
            <div className="flex items-center space-x-3 overflow-hidden">
              <p className="text-2xl font-bold md:text-3xl">{name}</p>
              { short_description && (
                <>
                  <div className="w-[2px] bg-gray-300 max-md:h-6 md:block md:h-8 flex-shrink-0"></div>
                  <p className="text-md max-md:text-sm font-light text-slate-500 truncate line-clamp-1">{short_description}</p>
                </>
              )}
            </div>
          </div>
          <p className="text-sm max-sm:hidden font-normal text-gray-700 md:text-base line-clamp-3">
            {long_description}
          </p>
          <div className="flex flex-wrap justify-start gap-2 overflow-hidden">
            <Badge type="category" value={category} />
            <Badge type="phase" value={phase} />
            <Badge type="launch_date" value={batch} />
            <Badge type="priority" value={priority} />
            <Badge type="status" value={status} />
          </div>
        </div>
      </button>
    </Link>
  );
}

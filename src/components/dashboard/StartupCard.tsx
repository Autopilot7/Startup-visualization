// components/StartupCard.tsx
import Badge from '@/components/dashboard/Badge';
import Image from 'next/image';

export type StartupCardProps = {
  name: string;
  short_description: string;
  long_description: string;
  logo: string;
  field: "Technology" | "Healthcare" | "Finance" | "Education" | "Travel" | "Others";
  status: 'Active' | 'Inactive';
  priority: 'P1' | 'P2' | 'P3';
  phase: 'Ideation' | 'Incubation' | 'Acceleration';
  launch_date: 'AY 2021' | 'AY 2022' | 'AY 2023' | 'AY 2024';
};

export const dummyStartupCardProps: StartupCardProps = {
  name: 'Finful',
  short_description:
    'Financial Version Of Duolingo',
  long_description:
    'A gamified app that teaches personal finance and investing through interactive lessons and quizzes, making financial literacy fun, engaging, and easy to learn.',
  logo: 'https://static.ybox.vn/2023/5/3/1683723223801-336640751_761918645261000_7516888285445287067_n.jpg',
  field: 'Finance',
  status: 'Active',
  priority: 'P1',
  phase: 'Incubation',
  launch_date: 'AY 2022',
};

export default function StartupCard({
  name,
  short_description,
  long_description,
  logo,
  field,
  status,
  priority,
  phase,
  launch_date,
}: StartupCardProps) {
  return (
    <div className="flex w-auto gap-4 rounded-2xl border border-slate-400 bg-white p-2 md:flex-row md:items-center md:p-4">
      <Image
        src={logo}
        width={100}
        height={100}
        className="max-md:mx-auto h-20 w-20 object-cover rounded-full md:mx-0 md:h-24 md:w-24"
        alt={`${name} Logo`}
      />
      <div className="space-y-2 text-left max-md:space-y-2">
        <div className="flex md:flex-row">
          <div className="flex flex-wrap items-center space-x-3">
            <p className="text-2xl font-bold md:text-3xl">{name}</p>
            <div className="w-[2px] bg-gray-300 max-md:h-6 md:block md:h-8"></div>
            <p className="text-md max-md:text-sm font-light text-slate-500">{short_description}</p>
          </div>
        </div>
        <p className="text-sm max-sm:hidden font-normal text-gray-700 md:text-base">
          {long_description}
        </p>
        <div className="flex flex-wrap justify-start gap-2">
          <Badge type="category" value={field} />
          <Badge type="phase" value={phase} />
          <Badge type="launch_date" value={launch_date} />
          <Badge type="priority" value={priority} />
          <Badge type="status" value={status} />
        </div>
      </div>
    </div>
  );
}

// components/StartupTable.tsx
import StartupCard, { StartupCardProps, dummyStartupCardProps } from '@/components/dashboard/StartupCard';

type StartupTableProps = {
  startups: StartupCardProps[];
};

export const dummyStartupTableProps: StartupTableProps = {
  startups: [
    {
      name: 'Finful',
      short_description:
        'Financial Version Of Duolingo',
      long_description:
        'A gamified app that teaches personal finance and investing through interactive lessons and quizzes, making financial literacy fun, engaging, and easy to learn.',
      logo: '/dummy_logo/finful.png',
      field: 'Finance',
      status: 'Active',
      priority: 'P1',
      phase: 'Incubation',
      launch_date: 'AY 2022',
    },
    {
      name: 'Reddit',
      short_description: 'The Front Page of the Internet',
      long_description:
        'A network of communities where people can dive into their interests, hobbies, and passions, and connect with others who share them.',
      logo: '/dummy_logo/reddit.png',
      field: 'Others',
      status: 'Active',
      priority: 'P3',
      phase: 'Acceleration',
      launch_date: 'AY 2021',
    },
    {
      name: 'Airbnb',
      short_description: 'Global Travel & Accommodations',
      long_description:
        'An online marketplace that connects people looking for lodging with those wanting to rent out their homes, offering a unique travel experience.',
      logo: '/dummy_logo/airbnb.png',
      field: 'Travel',
      status: 'Active',
      priority: 'P3',
      phase: 'Incubation',
      launch_date: 'AY 2022',
    },
    {
      name: 'Dropbox',
      short_description: 'Cloud Storage Simplified',
      long_description:
        'A cloud-based file storage and collaboration platform, offering secure storage and file sharing for individuals and businesses.',
      logo: '/dummy_logo/dropbox.png',
      field: 'Technology',
      status: 'Active',
      priority: 'P1',
      phase: 'Acceleration',
      launch_date: 'AY 2024',
    },
    {
      name: 'GitLab',
      short_description: 'The DevOps Platform',
      long_description:
        'An open-source DevOps platform that provides a suite of tools for developers to collaborate, build, and deploy code efficiently.',
      logo: '/dummy_logo/gitlab.png',
      field: 'Technology',
      status: 'Active',
      priority: 'P2',
      phase: 'Ideation',
      launch_date: 'AY 2023',
    },
    {
      name: 'Twitch',
      short_description: 'Streaming for Gamers',
      long_description:
        'A live streaming platform primarily focused on video games and esports but expanding to various types of live content.',
      logo: '/dummy_logo/twitch.png',
      field: 'Others',
      status: 'Active',
      priority: 'P3',
      phase: 'Acceleration',
      launch_date: 'AY 2023',
    },
    {
      name: 'Coursera',
      short_description: 'Online Learning for Everyone',
      long_description:
        'An online learning platform offering courses, specializations, and degrees from universities and institutions worldwide.',
      logo: '/dummy_logo/coursera.png',
      field: 'Education',
      status: 'Active',
      priority: 'P2',
      phase: 'Ideation',
      launch_date: 'AY 2024',
    },
    {
      name: 'Stripe',
      short_description: 'Online Payments Simplified',
      long_description:
        'A financial services and SaaS company that enables businesses to accept payments, manage revenue, and conduct financial operations online.',
      logo: '/dummy_logo/stripe.png',
      field: 'Finance',
      status: 'Inactive',
      priority: 'P1',
      phase: 'Acceleration',
      launch_date: 'AY 2021',
    },
    {
      name: 'Peloton',
      short_description: 'Interactive Fitness Equipment',
      long_description:
        'An exercise equipment and media company that offers stationary bikes and treadmills, providing access to live and on-demand fitness classes.',
      logo: '/dummy_logo/peloton.png',
      field: 'Healthcare',
      status: 'Inactive',
      priority: 'P2',
      phase: 'Acceleration',
      launch_date: 'AY 2021',
    }
  ]
};

export default function StartupTable({ startups }: StartupTableProps) {
  return (
    <div className="max-lg:space-y-4 lg:grid lg:grid-cols-2 md:gap-4">
      {startups.map((startup, index) => (
        <StartupCard key={index} {...startup} />
      ))}
    </div>
  );
}

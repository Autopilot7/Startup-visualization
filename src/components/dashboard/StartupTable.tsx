// components/StartupTable.tsx
import { useEffect, useRef, useCallback } from 'react';
import StartupCard, { StartupCardProps } from '@/components/dashboard/StartupCard';
import React from 'react';

export interface StartupTableProps {
  startups: StartupCardProps[];
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function StartupTable({ startups, hasMore, onLoadMore }: StartupTableProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, onLoadMore]);

  return (
    <>
      <div className="gap-4 xl:grid xl:grid-cols-2 max-xl:space-y-4">
        {startups.map((startup, index) => (
          <StartupCard key={`${startup.id}-${index}`} {...startup} />
        ))}
      </div>
      <div ref={observerTarget} className="h-10" />
    </>
  );
}

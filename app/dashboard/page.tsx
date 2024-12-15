'use client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Search } from './search';
import { ConferencesTable } from './users-table';
import { db } from '@/lib/db';
import { useMutation, useQuery } from '@tanstack/react-query';
import LoadingOverlay from '@/components/main/LoadingOverlay';

export default function IndexPage() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['conference-list'],
    queryFn: async () => {
      const response = await fetch(`/api/conference-list`, {
        next: {
          revalidate: 0
        }
      });
      if (!response.ok) throw new Error('Failed to load about');
      return response.json();
    }
  });

  return (
    <main className="flex flex-1 flex-col p-4 md:p-6">
      <div className="flex items-center mb-8">
        <h1 className="font-semibold text-lg md:text-2xl">Conferences</h1>
      </div>
      <div className="w-full mb-4 flex items-center gap-x-2">
        <div className="w-full">
          <Search />
        </div>
        <Link
          className={cn(buttonVariants({ variant: 'secondary' }))}
          href={'/dashboard/conferences/create'}
        >
          +
        </Link>
      </div>
      {isLoading ? (
        <div className="min-h-[500px] relative">
          <LoadingOverlay isLoading={isLoading} />
        </div>
      ) : (
        <ConferencesTable data={data} />
      )}
    </main>
  );
}

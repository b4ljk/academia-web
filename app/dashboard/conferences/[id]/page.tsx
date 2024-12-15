'use client';
import { useEffect } from 'react';
import TabsSection from './tabs';
import useConferenceStore from '@/store/conference';

export default function Page({ params }: { params: { id: string } }) {
  const { setId } = useConferenceStore();

  useEffect(() => {
    if (params.id) {
      setId(params.id);
    }
    return () => {
      setId('');
    };
  }, [params.id]);

  return (
    <div className="p-4 w-full">
      <TabsSection />
    </div>
  );
}

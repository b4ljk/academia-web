'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConferenceMenus } from '@/lib/config';
import { conferenceType } from '@/lib/schema-types';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { parseAsString, useQueryState } from 'nuqs';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import AboutTab from './about';
import CallForPaperTab from './call_for_paper';
import HomeTab from './home';
import ProgramTab from './program';

const TabsSection = () => {
  const { id } = useParams<{ id: string }>();
  const [currentTab, setCurrentTab] = useQueryState(
    'tab',
    parseAsString.withDefault('home')
  );

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['updateConference'],
    mutationFn: async (data: conferenceType) => {
      console.log(data);
      const response = await fetch('/api/conference', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create conference');
      return response.json();
    },
    onError: (error) => {
      console.error(error);
      toast.error('Failed to create conference');
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? 'Conference updated');
    }
  });

  const tabs: { [key: string]: JSX.Element } = useMemo(
    () => ({
      home: (
        <HomeTab
          isPending={isPending}
          mutateAsync={mutateAsync}
          faq={true}
          important
        />
      ),
      about: <AboutTab id={id} />,
      program: <ProgramTab />,
      'call-for-papers': <CallForPaperTab />
    }),
    [id, isPending, mutateAsync]
  );

  const tabContent = useMemo(
    () => tabs[currentTab] || tabs.home,
    [currentTab, tabs]
  );

  return (
    <Tabs defaultValue={currentTab || 'home'} className="w-full">
      <TabsList className="w-full">
        {ConferenceMenus.map((menu) => (
          <TabsTrigger
            key={menu.value}
            value={menu.value}
            className="flex-1"
            onClick={() => {
              setCurrentTab(menu.value);
            }}
          >
            {menu.title}
          </TabsTrigger>
        ))}
      </TabsList>
      <div>{tabContent}</div>
    </Tabs>
  );
};

export default TabsSection;

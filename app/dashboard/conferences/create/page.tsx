'use client';
import { useForm } from 'react-hook-form';
import { conferenceType } from '@/lib/schema-types';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeTab from '../[id]/home';

export default function CreateConference() {
  const form = useForm<conferenceType>();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['createConference'],
    mutationFn: async (data: conferenceType) => {
      const response = await fetch('/api/conference', {
        method: 'POST',
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
      toast.success('Conference created');
      setIsButtonDisabled(true);
      form.reset();
      router.replace(`/dashboard/conferences/${data.id}`);
    }
  });

  return (
    <div className="p-6">
      <h1 className="font-semibold text-lg md:text-2xl">Create Conference</h1>
      <HomeTab
        isButtonDisabled={isButtonDisabled}
        isPending={isPending}
        mutateAsync={mutateAsync}
      />
    </div>
  );
}

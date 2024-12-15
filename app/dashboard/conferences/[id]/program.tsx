'use client';

import EditorComponent from '@/components/main/Editor/Editor';
import LoadingOverlay from '@/components/main/LoadingOverlay';
import { InputWrapper } from '@/components/main/TextInput';
import { Button } from '@/components/ui/button';
import CommitteeForm from '@/components/widget/CommittieForm';
import OrganizerForm from '@/components/widget/OrganizerForm';
import SpeakerForm from '@/components/widget/SpeakerForm';
import {
  agendaType,
  committeeMembersType,
  committeeType,
  registrationType,
  venueType
} from '@/lib/schema-types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export interface CommitteesFront extends committeeType {
  committee_members: committeeMembersType[];
}

const ProgramTab = () => {
  const { id } = useParams<{ id: string }>();
  const form = useForm<venueType>();
  const [agendaHtml, setAgendaHtml] = useState('');
  const [registrationHtml, setRegistrationHtml] = useState('');

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['venue-post', id],
    mutationFn: async (data: venueType) => {
      const venue = fetch('/api/venue', {
        method: 'POST',
        body: JSON.stringify({
          conferenceId: id,
          html: data.html
        } as unknown as venueType)
      });

      const agenda = fetch('/api/agenda', {
        method: 'POST',
        body: JSON.stringify({
          conferenceId: id,
          html: agendaHtml
        } as unknown as agendaType)
      });

      const registration = fetch('/api/registration', {
        method: 'POST',
        body: JSON.stringify({
          conferenceId: id,
          html: registrationHtml
        } as unknown as registrationType)
      });

      const response = await Promise.all([venue, agenda, registration]);

      return response;
    }
  });

  const onSubmit = async (data: any) => {
    const response = await toast.promise(mutateAsync(data), {
      loading: 'Saving...',
      success: 'Successfully saved',
      error: 'Failed to save'
    });

    form.reset();
  };

  const { data: venue, isLoading: venueLoading } = useQuery<venueType>({
    queryKey: ['get-venue', id],
    queryFn: async () => {
      const response = await fetch(`/api/venue?id=${id}`, {
        next: {
          revalidate: 0
        }
      });
      if (!response.ok) throw new Error('Failed to fetch venue');
      return response.json();
    }
  });

  const { data: agenda, isLoading: agendaLoading } = useQuery<agendaType>({
    queryKey: ['get-agenda', id],
    queryFn: async () => {
      const response = await fetch(`/api/agenda?id=${id}`, {
        next: {
          revalidate: 0
        }
      });
      if (!response.ok) throw new Error('Failed to fetch agenda');
      return response.json();
    }
  });

  const { data: registration, isLoading: registrationLoading } =
    useQuery<registrationType>({
      queryKey: ['get-registration', id],
      queryFn: async () => {
        const response = await fetch(`/api/registration?id=${id}`, {
          next: {
            revalidate: 0
          }
        });
        if (!response.ok) throw new Error('Failed to fetch registration');
        return response.json();
      }
    });

  return (
    <section className="relative">
      <LoadingOverlay isLoading={venueLoading} />
      <InputWrapper label="Committee" className="mt-8">
        <CommitteeForm />
      </InputWrapper>

      <InputWrapper label="Speakers">
        <SpeakerForm />
      </InputWrapper>
      <InputWrapper label="Organizers">
        <OrganizerForm />
      </InputWrapper>

      <div className="pt-16">
        <Controller
          control={form.control}
          name="html"
          rules={{
            required: 'This field is required'
          }}
          render={({ field }) => (
            <InputWrapper
              label="Conference Venue"
              error={form.formState.errors.html?.message}
            >
              <EditorComponent
                defaultValue={venue?.html ?? ''}
                setHtml={(value) => field.onChange(value)}
              />
            </InputWrapper>
          )}
        />
      </div>
      <div className="pt-16">
        <Controller
          control={form.control}
          name="html"
          rules={{
            required: 'This field is required'
          }}
          render={({ field }) => (
            <InputWrapper
              label="Agenda"
              error={form.formState.errors.html?.message}
            >
              <EditorComponent
                defaultValue={agenda?.html ?? ''}
                setHtml={(value) => setAgendaHtml(value)}
              />
            </InputWrapper>
          )}
        />
      </div>
      <div className="pt-16">
        <Controller
          control={form.control}
          name="html"
          rules={{
            required: 'This field is required'
          }}
          render={({ field }) => (
            <InputWrapper
              label="Registration"
              error={form.formState.errors.html?.message}
            >
              <EditorComponent
                defaultValue={registration?.html ?? ''}
                setHtml={(value) => setRegistrationHtml(value)}
              />
            </InputWrapper>
          )}
        />
      </div>
      <Button
        onClick={form.handleSubmit(onSubmit)}
        loading={isPending}
        className="mt-4"
      >
        Save
      </Button>
    </section>
  );
};

export default ProgramTab;

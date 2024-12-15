import EditorComponent from '@/components/main/Editor/Editor';
import LoadingOverlay from '@/components/main/LoadingOverlay';
import { InputWrapper } from '@/components/main/TextInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  callForPaperType,
  designGuidelinesType,
  submissionType
} from '@/lib/schema-types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { is } from 'drizzle-orm';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PaperSubmission } from './submission';

const CallForPaperTab = () => {
  const { id } = useParams<{ id: string }>();

  const form = useForm<callForPaperType>();
  const submissionForm = useForm<submissionType>();
  const designGuidelinesForm = useForm<designGuidelinesType>();

  const { mutateAsync: sumissionSubmit, isPending: submissionPending } =
    useMutation({
      mutationKey: ['update-submission', id],
      mutationFn: async (data: submissionType) => {
        const response = await fetch('/api/submission', {
          method: 'POST',
          body: JSON.stringify({
            conferenceId: id,
            ...data,
            html: data.html
          } as unknown as submissionType)
        });
        if (!response.ok)
          throw new Error('Failed to create call for Submission');
        return response.json();
      }
    });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['updateCallForPaper', id],
    mutationFn: async (data: callForPaperType) => {
      const response = await fetch('/api/call-for-paper', {
        method: 'POST',
        body: JSON.stringify({
          conferenceId: id,
          title: 'Call for paper',
          html: data.html
        } as unknown as callForPaperType)
      });
      if (!response.ok) throw new Error('Failed to create call for paper');
      return response.json();
    }
  });

  const { mutateAsync: designUpdate, isPending: designPending } = useMutation({
    mutationKey: ['update-design-guidelines', id],
    mutationFn: async (data: callForPaperType) => {
      const response = await fetch('/api/design-guideline', {
        method: 'POST',
        body: JSON.stringify({
          conferenceId: id,
          title: 'Style guideline',
          html: data.html
        } as unknown as callForPaperType)
      });
      if (!response.ok) throw new Error('Failed to create design guideline');
      return response.json();
    }
  });

  const { data, isLoading } = useQuery<callForPaperType>({
    queryKey: ['call-for-paper', id],
    queryFn: async () => {
      const response = await fetch(`/api/call-for-paper?id=${id}`, {
        next: {
          revalidate: 0
        }
      });
      if (!response.ok) throw new Error('Failed to load about');
      return response.json();
    },
    enabled: !!id
  });

  const { data: designGuideline, isLoading: designGuidelineLoading } =
    useQuery<designGuidelinesType>({
      queryKey: ['design-guideline', id],
      queryFn: async () => {
        const response = await fetch(`/api/design-guideline?id=${id}`, {
          next: {
            revalidate: 0
          }
        });
        if (!response.ok) throw new Error('Failed to load about');
        return response.json();
      },
      enabled: !!id
    });

  const onSubmit = async (data: callForPaperType) => {
    if (isPending || designPending) return;
    const submissionData = submissionForm.getValues();
    const designData = designGuidelinesForm.getValues();
    const response = await toast.promise(
      Promise.all([
        mutateAsync(data),
        sumissionSubmit(submissionData),
        designUpdate(designData)
      ]),

      {
        loading: 'Saving...',
        success: (data) => 'Data updated',
        error: 'Failed to update call for paper'
      }
    );
  };

  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
      <LoadingOverlay isLoading={isLoading || designGuidelineLoading} />
      <div className="space-y-4 py-8">
        <div className="space-y-5">
          <PaperSubmission submissionForm={submissionForm} />
          <Controller
            control={designGuidelinesForm.control}
            name="html"
            rules={{
              required: 'This field is required'
            }}
            render={({ field }) => (
              <InputWrapper
                label="Style Guidelines"
                error={form.formState.errors.description?.message}
              >
                <EditorComponent
                  defaultValue={designGuideline?.html ?? ''}
                  setHtml={(value) => field.onChange(value)}
                />
              </InputWrapper>
            )}
          />
          <Controller
            control={form.control}
            name="html"
            rules={{
              required: 'This field is required'
            }}
            render={({ field }) => (
              <InputWrapper
                label="Call For Paper"
                error={form.formState.errors.description?.message}
              >
                <EditorComponent
                  defaultValue={data?.html ?? ''}
                  setHtml={(value) => field.onChange(value)}
                />
              </InputWrapper>
            )}
          />
        </div>
        <Button>Save</Button>
      </div>
    </form>
  );
};

export default CallForPaperTab;

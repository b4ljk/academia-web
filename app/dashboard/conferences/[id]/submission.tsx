import EditorComponent from '@/components/main/Editor/Editor';
import LoadingOverlay from '@/components/main/LoadingOverlay';
import { InputWrapper } from '@/components/main/TextInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submissionType } from '@/lib/schema-types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { is } from 'drizzle-orm';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export const PaperSubmission = ({
  submissionForm
}: {
  submissionForm: ReturnType<typeof useForm>;
}) => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery<submissionType>({
    queryKey: ['get-submission', id],
    queryFn: async () => {
      const response = await fetch(`/api/submission?id=${id}`, {
        next: {
          revalidate: 0
        }
      });
      if (!response.ok) throw new Error('Failed to load about');
      return response.json();
    },
    enabled: !!id
  });

  useEffect(() => {
    if (data) {
      submissionForm.reset(data);
    }
  }, [data]);

  return (
    <div className="space-y-5">
      <div className="flex space-x-3">
        <InputWrapper
          label="Title"
          className="w-full"
          error={submissionForm.formState.errors.title?.message}
        >
          <Input
            {...submissionForm.register('title', {
              required: 'This field is required'
            })}
          />
        </InputWrapper>
        <InputWrapper
          className="w-full"
          label="Link"
          error={submissionForm.formState.errors.link?.message}
        >
          <Input
            type="url"
            placeholder="https://example.com"
            {...submissionForm.register('link', {
              required: 'This field is required'
            })}
          />
        </InputWrapper>
      </div>
      <Controller
        control={submissionForm.control}
        name="html"
        rules={{
          required: 'This field is required'
        }}
        render={({ field }) => (
          <InputWrapper
            label="Submission"
            error={submissionForm.formState.errors.html?.message}
          >
            <EditorComponent
              defaultValue={data?.html ?? ''}
              setHtml={(value) => field.onChange(value)}
            />
          </InputWrapper>
        )}
      />
    </div>
  );
};

import EditorComponent from '@/components/main/Editor/Editor';
import LoadingOverlay from '@/components/main/LoadingOverlay';
import { InputWrapper } from '@/components/main/TextInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aboutType } from '@/lib/schema-types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
interface AboutTabProps {
  id?: string;
}

interface AboutForm {
  description?: {
    text: string;
    html: string;
  };
  youtube_url: string;
  shorter_html?: string;
}

const AboutTab = ({ id }: AboutTabProps) => {
  const form = useForm<AboutForm>();
  const { mutate, isPending } = useMutation({
    mutationKey: ['updateAbout'],
    mutationFn: async (data: AboutForm) => {
      console.log('helloo');

      const response = await fetch('/api/conference/about', {
        method: 'POST',
        body: JSON.stringify({
          conferenceId: id,
          html: data.description?.html,
          text: data.description?.text,
          youtube_url: data.youtube_url,
          shorter_html: data.shorter_html
        } as aboutType)
      });
      if (!response.ok) throw new Error('Failed to create about');
      return response.json();
    },
    onSuccess: () => {
      console.log('helloo');
      toast.success('About updated');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const { data, isLoading } = useQuery<aboutType>({
    queryKey: ['about', id],
    queryFn: async () => {
      const response = await fetch(`/api/conference/about?id=${id}`, {
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
      form.setValue('description', {
        text: data.text ?? '',
        html: data.html ?? ''
      });
      form.setValue('youtube_url', data.youtube_url ?? '');
    }
  }, [data]);

  return (
    <form onSubmit={form.handleSubmit(mutate as any)} className="relative">
      <LoadingOverlay isLoading={isLoading} />
      <div className="space-y-4 py-8">
        <div className="space-y-4">
          <div className="mb-4">
            <Controller
              control={form.control}
              name="description"
              rules={{
                required: 'This field is required'
              }}
              render={({ field }) => (
                <InputWrapper
                  // label="Content"
                  error={form.formState.errors.description?.message}
                >
                  <EditorComponent
                    defaultValue={data?.html ?? ''}
                    setHtml={(value) =>
                      field.onChange({ ...field.value, html: value })
                    }
                  />
                </InputWrapper>
              )}
            />
          </div>
          <InputWrapper
            label="Youtube Link"
            className="col-span-1 lg:col-span-2"
            error={form.formState.errors.youtube_url?.message}
          >
            <Input
              {...form.register('youtube_url', {
                // required: 'This field is required'
              })}
              placeholder="Enter youtube url"
            />
          </InputWrapper>
          <InputWrapper
            label="Shorter about for hero"
            className="col-span-1 lg:col-span-2"
            error={form.formState.errors.youtube_url?.message}
          >
            <Controller
              control={form.control}
              name="shorter_html"
              rules={{
                required: 'This field is required'
              }}
              render={({ field }) => (
                <InputWrapper
                  // label="Content"
                  error={form.formState.errors.shorter_html?.message}
                >
                  <EditorComponent
                    defaultValue={data?.shorter_html ?? ''}
                    setHtml={(value) => field.onChange(value)}
                  />
                </InputWrapper>
              )}
            />
          </InputWrapper>
        </div>
      </div>
      <div className="flex">
        <Button loading={isPending} disabled={isPending} type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};

export default AboutTab;

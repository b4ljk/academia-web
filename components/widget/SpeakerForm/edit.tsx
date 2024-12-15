'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { InputWrapper } from '@/components/main/TextInput';
import { Combobox } from '@/components/ui/combo-box';

import { COUNTRY_LIST } from '@/lib/country_list';
import { speakerType } from '@/lib/schema-types';
import { cn } from '@/lib/utils';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useConferenceStore from '@/store/conference';
import { CommitteesFront } from '../CommittieForm';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function SpeakerEdit({ data, id }: { data: any; id?: number }) {
  const form = useForm<speakerType>({ defaultValues: data });
  const [imageLoading, setImageLoading] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { id: conferenceId } = useConferenceStore();

  const { mutateAsync } = useMutation({
    mutationKey: ['edit-speaker', conferenceId],
    mutationFn: async (data: speakerType) => {
      const response = await fetch(`/api/speaker`, {
        method: 'PUT',
        body: JSON.stringify({ ...data, conferenceId: conferenceId })
      });
      if (!response.ok) throw new Error('Failed to add committee');
      return response.json();
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ['get-speaker', conferenceId]
      });

      //   refresh
      router.refresh();
    },
    onError: (err, newTodo, context) => {
      toast.error('Failed to add committee');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-speaker', conferenceId]
      });
    }
  });

  const handleData = async (data: speakerType) => {
    try {
      toast.promise(mutateAsync(data), {
        loading: 'Saving changes...',
        success: 'Changes saved successfully',
        error: 'Failed to save changes'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  console.log(form.formState.errors);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Edit the speaker details and click save changes
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <InputWrapper
            label="Person's name"
            className="w-full"
            error={form.formState.errors.name?.message}
          >
            <Input
              id="name"
              className="col-span-3"
              {...form.register('name', {
                required: "Person's name is required"
              })}
            />
          </InputWrapper>
          <InputWrapper
            label="Country"
            className="w-full"
            error={form.formState.errors.name?.message}
          >
            <Controller
              control={form.control}
              name="country"
              render={({ field }) => (
                <Combobox
                  className="h-10 mt-1 justify-start"
                  onChange={(value) => field.onChange(value)}
                  defaultValue={field.value as any}
                  data={COUNTRY_LIST.map((country) => ({
                    value: country.code,
                    label: country.name
                  }))}
                />
              )}
            />
          </InputWrapper>
          <InputWrapper
            label="Description"
            className="w-full"
            error={form.formState.errors.description?.message}
          >
            <Input
              className="col-span-3"
              {...form.register('description', {
                required: 'Description is required'
              })}
            />
          </InputWrapper>
          {/* image input */}
          <InputWrapper
            label="Image"
            className="w-full"
            error={form.formState.errors.avatar?.message}
          >
            <div className="flex items-center">
              <Controller
                control={form.control}
                name="avatar"
                rules={{
                  required: 'Image is required'
                }}
                render={({ field }) => (
                  <Input
                    type="file"
                    className="col-span-3"
                    accept="image/*"
                    ref={field.ref}
                    name={field.name}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageLoading(true);
                        // TODO: IDEALLY NEED TO COMPRESS IMAGE BEFORE UPLOADING
                        const response = await fetch('/api/upload', {
                          method: 'POST',
                          body: file,
                          headers: {
                            'X-Filename': file.name
                          }
                        });
                        const data = await response.json();
                        field.onChange(data.url);
                        setImageLoading(false);
                      }
                    }}
                  />
                )}
              />
              <LoaderCircle
                className={cn('animate-spin ml-3', {
                  hidden: !imageLoading
                })}
              />
            </div>
          </InputWrapper>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={form.handleSubmit(handleData)}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

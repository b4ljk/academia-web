'use client';
import { CommitteesFront } from '@/app/dashboard/conferences/[id]/program';
import { InputWrapper } from '@/components/main/TextInput';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combo-box';
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
import { COUNTRY_LIST } from '@/lib/country_list';
import { organizerType } from '@/lib/schema-types';
import { cn } from '@/lib/utils';
import useConferenceStore from '@/store/conference';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, Pencil, Plus, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function EditOrganizer({ data }: { data: any }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [imageLoading, setImageLoading] = useState(false);
  const { id: conferenceId } = useConferenceStore();

  const form = useForm<organizerType>({
    defaultValues: data
  });

  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationKey: ['edit-organizer'],
    mutationFn: async (data: organizerType) => {
      const response = await fetch(`/api/organizer`, {
        method: 'PUT',
        body: JSON.stringify({ ...data, conferenceId: conferenceId })
      });
      if (!response.ok) throw new Error('Failed to edit organizer');
      return response.json();
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ['get-organizer', conferenceId]
      });

      //  refresh
      router.refresh();
    },
    onError: (err, newTodo, context) => {
      toast.error('Failed to edit organizer');
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-organizer', conferenceId]
      });
    }
  });

  const handleData = async (data: organizerType) => {
    try {
      toast.promise(mutateAsync(data), {
        loading: 'Saving changes...',
        success: () => {
          setOpen(false);
          return 'Changes saved';
        },
        error: 'Failed to save changes'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit</DialogTitle>
          <DialogDescription>
            Edit the organizer details and click save changes
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
            label="Image"
            className="w-full"
            error={form.formState.errors.logo?.message}
          >
            <div className="flex items-center">
              <Controller
                control={form.control}
                name="logo"
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
          <Button
            type="submit"
            onClick={form.handleSubmit((data) => handleData(data))}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

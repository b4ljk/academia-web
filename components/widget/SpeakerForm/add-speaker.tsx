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
import { speakerType } from '@/lib/schema-types';
import { cn } from '@/lib/utils';
import useConferenceStore from '@/store/conference';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LoaderCircle, Plus, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card';

export function AddMember({ id }: { id?: string | number }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const [imageLoading, setImageLoading] = useState(false);
  const { id: conferenceId } = useConferenceStore();

  const form = useForm<speakerType>();

  const { mutateAsync } = useMutation({
    mutationKey: ['addCommittee', id],
    mutationFn: async (data: speakerType) => {
      const response = await fetch(`/api/speaker`, {
        method: 'POST',
        body: JSON.stringify({ ...data, conferenceId: conferenceId })
      });
      if (!response.ok) throw new Error('Failed to add committee');
      return response.json();
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: ['get-speaker', conferenceId]
      });
      const prev = queryClient.getQueryData(['get-speaker', conferenceId]);

      queryClient.setQueryData(
        ['get-speaker', conferenceId],
        (old: CommitteesFront[]) => {
          if (!old) return [];
          try {
            const newData = old?.map((item) => {
              if (item.id == id) {
                return {
                  ...item,
                  committee_members: [...item.committee_members, data]
                };
              }
              return item;
            });
            console.log(newData);
            return newData;
          } catch (e) {
            console.error(e);
            return old;
          }
        }
      );

      return { prev };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['get-speaker', conferenceId], context?.prev);
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
        error: 'Failed to add committee',
        loading: 'Adding committee...',
        success: 'Committee added'
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
        <div className=" gap-2 flex flex-col w-full">
          <Button variant="outline">
            <Plus size={25} className="mr-3" />
            Add speaker{' '}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a speaker </DialogTitle>
          <DialogDescription>
            Add a new committee member to the conference
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

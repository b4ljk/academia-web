import { InputWrapper } from '@/components/main/TextInput';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CommitteesFront } from './program';

export function AddCommittee() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationKey: ['addCommittee', id],
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/committee`, {
        method: 'POST',
        body: JSON.stringify({
          conferenceId: id,
          name: name
        })
      });
      if (!response.ok) throw new Error('Failed to add committee');
      return response.json();
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['getCommittees', id] });
      const prev = queryClient.getQueryData(['getCommittees', id]);

      queryClient.setQueryData(
        ['getCommittees', id],
        (old: CommitteesFront[]) => [
          ...old,
          {
            committee_members: [],
            name: name
          } as unknown as CommitteesFront
        ]
      );

      return { prev };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['getCommittees', id], context?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['getCommittees', id] });
    }
  });

  const handleData = async (data: any) => {
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
            Add a new committee type{' '}
          </Button>
          <p className="text-sm text-gray-400 text-center">
            (Standing, ad-hoc, or special etc...)
          </p>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Committee</DialogTitle>
          <DialogDescription>
            Add a new committee type to the conference.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <InputWrapper label="Committee name" className="w-full">
            <Input
              id="name"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              placeholder="Standing, ad-hoc, or special etc..."
            />
          </InputWrapper>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleData}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

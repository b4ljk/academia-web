'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { conferenceType } from '@/lib/schema-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  Eye,
  Pencil,
  ScrollText,
  Trash,
  UserRound,
  UsersRound
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { UserTableDelete } from './delete-confirm';
import { cn } from '@/lib/utils';

export function ConferencesTable({ data }: { data: conferenceType[] }) {
  return (
    <>
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Name</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((conference) => (
              <ConferenceRow key={conference.id} conference={conference} />
            ))}
          </TableBody>
        </Table>
      </form>
    </>
  );
}

function ConferenceRow({ conference }: { conference: conferenceType }) {
  // const conferenceId = conference.id;
  // const deleteUserWithId = deleteUser.bind(null, conferenceId);
  const date = dayjs(conference.start).format('YYYY-MM-DD');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['deleteConference', conference.id],
    mutationFn: async () => {
      const response = await fetch(`/api/conference/${conference.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        console.error('Failed to delete conference');
        return new Error('Failed to delete conference');
      }
      console.log('Conference deleted');
    },

    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: ['conference-list']
      });
      const prev = queryClient.getQueryData(['conference-list']);
      queryClient.setQueryData(['conference-list'], (old: conferenceType[]) =>
        old.filter((conf) => conf.id !== conference.id)
      );
      return { prev };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['conference-list'], context?.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['conference-list'] });
    }
  });

  const handleDelete = async () => {};
  return (
    <TableRow>
      <TableCell className="font-medium">{conference.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        {conference.city}, {conference.country}
      </TableCell>
      <TableCell>
        {dayjs(conference.start).format('MMM D, YYYY')} -{' '}
        {dayjs(conference.end).format('MMM D, YYYY')}
      </TableCell>
      <TableCell>
        <div className="flex space-x-4">
          <Link href={`/dashboard/conferences/${conference.id}`}>
            <Button>
              <Pencil size={16} />
            </Button>
          </Link>

          <UserTableDelete
            onDelete={async () =>
              toast.promise(mutateAsync(), {
                loading: 'Deleting...',
                success: 'Conference deleted',
                error: 'Failed to delete conference'
              })
            }
          >
            <Button
              variant="destructive"
              type="button"
              loading={isPending}
              disabled={isPending}
            >
              <Trash size={16} />
            </Button>
          </UserTableDelete>
          <a
            href={`https://academic-front.vercel.app/conference/${conference.id}`}
            target="_blank"
          >
            <Button variant="secondary" type="button">
              <Eye size={16} />
            </Button>
          </a>
          <Link
            href={`/dashboard/registrees/${conference.id}`}
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            <UsersRound size={16} />
          </Link>
          <Link
            href={`/dashboard/submissions/${conference.id}`}
            className={cn(buttonVariants({ variant: 'secondary' }))}
          >
            <ScrollText size={18} />
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}

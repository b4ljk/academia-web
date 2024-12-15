'use client';

import LoadingOverlay from '@/components/main/LoadingOverlay';
import MainTable from '@/components/main/MainTable';
import { Button } from '@/components/ui/button';
import { committeeMembersType, committeeType } from '@/lib/schema-types';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Trash } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { AddCommittee } from './add-committee';

export interface CommitteesFront extends committeeType {
  committee_members: committeeMembersType[];
}

const CommitteeForm = () => {
  const { id } = useParams<{ id: string }>();

  //   const { mutateAsync, isPending } = useMutation({
  //     mutationKey: ['venue-post', id],
  //     mutationFn: async (data: venueType) => {
  //       const response = await fetch('/api/venue', {
  //         method: 'POST',
  //         body: JSON.stringify({
  //           conferenceId: id,
  //           html: data.html
  //         } as unknown as venueType)
  //       });
  //       if (!response.ok) throw new Error('Failed to create call for paper');
  //       return response.json();
  //     }
  //   });

  //   const onSubmit = async (data: any) => {
  //     const response = await toast.promise(mutateAsync(data), {
  //       loading: 'Saving...',
  //       success: 'Successfully saved',
  //       error: 'Failed to save'
  //     });

  //     if (response.ok) {
  //       form.reset();
  //     }
  //   };

  const { data, isLoading } = useQuery<CommitteesFront[]>({
    queryKey: ['getCommittees', id],
    queryFn: async () => {
      const response = await fetch(`/api/committee?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch committees');
      return response.json();
    }
  });

  return (
    <section className="relative">
      <LoadingOverlay isLoading={isLoading} />

      <div className="space-y-4 py-8">
        <div>
          <AddCommittee />
        </div>
        {data &&
          data?.map((committee) => (
            <MainTable
              id={committee.id}
              key={committee.id}
              columns={[
                {
                  title: 'Name',
                  key: 'name'
                },
                {
                  title: 'Profession',
                  key: 'profession'
                },
                {
                  title: 'Country',
                  key: 'country'
                },
                {
                  title: 'Image',
                  key: 'image',
                  render: (record) => {
                    return (
                      <div className="relative h-[24px] rounded-full aspect-square">
                        {/* {JSON.stringify(record.avatar)} */}
                        <Image
                          src={record?.image}
                          fill
                          className="rounded-full object-cover"
                          alt="avatar"
                          quality={80}
                        />
                      </div>
                    );
                  }
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (record) => (
                    <div className="space-x-4">
                      <Button>
                        <Pencil size={16} />
                      </Button>
                      <Button variant="destructive" type="button">
                        <Trash size={16} />
                      </Button>
                    </div>
                  )
                }
              ]}
              dataSource={committee?.committee_members?.map((member) => ({
                name: member.name,
                profession: member.affilation,
                image: member.avatar,
                id: member.id,
                country: member.country
              }))}
              title={committee.name}
            />
          ))}
      </div>

      {/* <Button onClick={form.handleSubmit(onSubmit)}>Save</Button> */}
    </section>
  );
};

export default CommitteeForm;

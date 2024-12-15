'use client';

import LoadingOverlay from '@/components/main/LoadingOverlay';
import MainTable from '@/components/main/MainTable';
import { Button } from '@/components/ui/button';
import {
  committeeMembersType,
  committeeType,
  speakerType
} from '@/lib/schema-types';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Trash } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { AddMember } from './add-speaker';
import { SpeakerEdit } from './edit';

const SpeakerForm = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery<speakerType[]>({
    queryKey: ['get-speaker', id],
    queryFn: async () => {
      const response = await fetch(`/api/speaker?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch committees');
      return response.json();
    }
  });

  return (
    <div className="relative">
      <LoadingOverlay isLoading={isLoading} />

      <div className="space-y-4 py-8">
        <div>
          <AddMember />
        </div>

        {data && (
          <MainTable
            id={id}
            key={id}
            columns={[
              {
                title: 'Name',
                key: 'name'
              },
              {
                title: 'Description',
                key: 'description',
                render: (record) => {
                  return (
                    <p className="truncate w-[600px] overflow-hidden">
                      {record.description}
                    </p>
                  );
                }
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
                        src={record?.avatar}
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
                    <SpeakerEdit data={record} />
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={async () => {
                        const response = await fetch(
                          `/api/speaker?id=${record.id}`,
                          {
                            method: 'DELETE'
                          }
                        );
                        if (response.ok) {
                          window.location.reload();
                        }
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                )
              }
            ]}
            dataSource={data}
            // title={'BEST'}
          />
        )}
      </div>
    </div>
  );
};

export default SpeakerForm;

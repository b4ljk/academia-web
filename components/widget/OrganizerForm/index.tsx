'use client';

import LoadingOverlay from '@/components/main/LoadingOverlay';
import MainTable from '@/components/main/MainTable';
import { Button } from '@/components/ui/button';
import {
  committeeMembersType,
  committeeType,
  organizerType,
  speakerType
} from '@/lib/schema-types';
import { useQuery } from '@tanstack/react-query';
import { Pencil, Trash } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { AddMember } from './add-speaker';
import { EditOrganizer } from './edit';

const OrganizerForm = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery<organizerType[]>({
    queryKey: ['get-organizer', id],
    queryFn: async () => {
      const response = await fetch(`/api/organizer?id=${id}`);
      if (!response.ok) throw new Error('Failed to fetch organizer');
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
                title: 'Logo',
                key: 'logo',
                render: (record) => {
                  return (
                    <div className="relative h-[24px] rounded-full aspect-square">
                      {/* {JSON.stringify(record.avatar)} */}
                      <Image
                        src={record?.logo}
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
                    <EditOrganizer data={record} />
                    <Button
                      variant="destructive"
                      type="button"
                      onClick={async () => {
                        const response = await fetch(
                          `/api/organizer?id=${record.id}`,
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

export default OrganizerForm;

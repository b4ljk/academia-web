'use client';

import { Button } from '@/components/ui/button';
import { Conditional } from '@/components/ui/conditional';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { registeredUserType } from '@/lib/schema-types';
import { useQuery } from '@tanstack/react-query';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function Page({
  params
}: {
  params: {
    id: string;
  };
}) {
  const { data } = useQuery<registeredUserType[]>({
    queryKey: ['registrees', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/registrees/${params.id}`);
      return response.json();
    }
  });
  const [detail, setDetail] = useState<registeredUserType | null>(null);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">REGISTREES</h1>
      </div>
      <div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-[150px]">Headshot</TableHead>
                <TableHead className="max-w-[150px]">Fist Name</TableHead>
                <TableHead className="hidden md:table-cell">
                  Last Name
                </TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead className="hidden md:table-cell">Country</TableHead>
                <TableHead className="hidden md:table-cell">
                  Organization
                </TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <Conditional condition={data && data?.length === 0}>
                <div>No data</div>
              </Conditional>
              {data?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Image
                      src={user.profile_picture ?? ''}
                      alt={'profile'}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.lastName}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.phone}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.country}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.organization}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Dialog>
                      <DialogTrigger>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            // deleteUserWithId();
                            setDetail(user);
                          }}
                        >
                          <Eye size={18} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-6 bg-gray-100 text-gray-900 rounded-lg shadow-md h-[90vh] overflow-y-auto">
                        <DialogHeader className="border-b border-gray-300 pb-4">
                          <DialogTitle className="text-3xl font-semibold text-center text-gray-800">
                            Registree Detail
                          </DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col gap-6 mt-6  ">
                          <div className="flex items-center gap-4">
                            <Image
                              src={detail?.profile_picture ?? ''}
                              alt="profile"
                              width={150}
                              height={150}
                              className="rounded-full border border-gray-300 shadow-sm"
                            />
                            <div className="space-y-2">
                              <p>
                                <span className="font-semibold text-gray-600">
                                  First Name:{' '}
                                </span>
                                {detail?.firstName}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-600">
                                  Last Name:{' '}
                                </span>
                                {detail?.lastName}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-600">
                                  Degree:{' '}
                                </span>
                                {detail?.degree}
                              </p>
                              <p>
                                <span className="font-semibold text-gray-600">
                                  Position:{' '}
                                </span>
                                {detail?.position}
                              </p>
                            </div>
                          </div>

                          <div className="bg-white p-5 rounded-md shadow-sm space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700">
                              Contact
                            </h3>
                            <p>
                              <span className="font-semibold">Email: </span>
                              {detail?.email}
                            </p>
                            <p>
                              <span className="font-semibold">Phone: </span>
                              {detail?.phone}
                            </p>
                            <p>
                              <span className="font-semibold">Country: </span>
                              {detail?.country}
                            </p>
                            <p>
                              <span className="font-semibold">ZIP Code: </span>
                              {detail?.zip_code}
                            </p>
                          </div>

                          <div className="bg-white p-5 rounded-md shadow-sm space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700">
                              Organization
                            </h3>
                            <p>{detail?.organization}</p>
                            <p>{detail?.address_of_organization}</p>
                          </div>

                          <div className="bg-white p-5 rounded-md shadow-sm space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700">
                              Paper
                            </h3>
                            <p>
                              <span className="font-semibold">Title: </span>
                              {detail?.title_of_paper}
                            </p>
                            <p>{detail?.abstract}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

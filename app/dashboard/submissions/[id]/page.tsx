'use client';

import { Button, buttonVariants } from '@/components/ui/button';
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
import { registeredUserType, submissionFileType } from '@/lib/schema-types';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import {
  Ellipsis,
  Eye,
  HardDriveDownload,
  Loader2,
  ScrollText
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Page({
  params
}: {
  params: {
    id: string;
  };
}) {
  const { data, isFetching } = useQuery<submissionFileType[]>({
    queryKey: ['registrees', params.id],
    queryFn: async () => {
      // /api/pub/conference/[id]/submissions
      const response = await fetch(
        `/api/pub/conference/${params.id}/submissions`
      );
      return response.json();
    }
  });
  const [detail, setDetail] = useState<submissionFileType | null>(null);
  const [docUrl, setDocUrl] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 3000); // Adjust this timeout as needed

  //   return () => clearTimeout(timer);
  // }, [docUrl]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">SUBMISSIONS</h1>
      </div>
      <div>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="max-w-[150px]">Title</TableHead>
                <TableHead className="max-w-[150px]">Author</TableHead>
                <TableHead className="hidden md:table-cell">Poster</TableHead>
                <TableHead className="hidden md:table-cell">Download</TableHead>
                <TableHead className="hidden md:table-cell"></TableHead>
                {/* <TableHead className="hidden md:table-cell">Phone</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              <Conditional condition={data && data?.length === 0}>
                <div>No data</div>
              </Conditional>
              <Conditional condition={isFetching}>
                <TableRow>
                  <TableCell colSpan={99}>
                    <div className="min-h-14">
                      <Loader2 className="h-8 w-8 animate-spin m-auto" />
                    </div>
                  </TableCell>
                </TableRow>
              </Conditional>
              {data?.map((item) => {
                let authors: string | string[] = '';

                try {
                  authors = JSON.parse(item.authors ?? '');
                } catch (e) {
                  authors = item.authors ?? '';
                }

                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>
                      {Array.isArray(authors) ? authors?.join(', ') : authors}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.is_poster ? 'Poster' : 'Not Poster'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Button
                        variant={'secondary'}
                        onClick={() => {
                          setDocUrl(item.paper);
                          setIsLoading(true);
                        }}
                      >
                        <HardDriveDownload size={18} />
                      </Button>
                    </TableCell>

                    <TableCell className="hidden md:table-cell">
                      <Dialog>
                        <DialogTrigger>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              // deleteUserWithId();
                              setDetail(item);
                            }}
                          >
                            <Ellipsis />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="p-6 bg-gray-100 text-gray-900 rounded-lg shadow-md h-[90vh] overflow-y-auto flex flex-col justify-start">
                          <DialogHeader className="border-b border-gray-300 pb-4">
                            <DialogTitle className="text-3xl font-semibold text-center text-gray-800">
                              Submission Detail
                            </DialogTitle>
                          </DialogHeader>

                          <div className="flex flex-col gap-6 mt-6  ">
                            <div className="bg-white p-5 rounded-md shadow-sm space-y-4">
                              <h3 className="text-xl font-semibold text-gray-700">
                                Contact
                              </h3>
                              <p>
                                <span className="font-semibold">Title: </span>
                                {detail?.title}
                              </p>
                              <p>
                                <span className="font-semibold">Authors: </span>
                                <div>
                                  {(Array.isArray(authors)
                                    ? authors?.map((author, index) => (
                                        <p key={author + index}>
                                          <span className="font-bold">
                                            {index + 1}.{' '}
                                          </span>
                                          {author}
                                        </p>
                                      ))
                                    : authors) ?? ''}
                                </div>
                              </p>
                              <p>
                                <span className="font-semibold">Poster: </span>
                                {detail?.is_poster ? 'Yes' : 'No'}
                              </p>
                              <p>
                                <span className="font-semibold">
                                  Conference ID:{' '}
                                </span>
                                {detail?.conferenceId}
                              </p>

                              <Button
                                variant={'secondary'}
                                className="w-full"
                                onClick={() => {
                                  setDocUrl(item.paper);
                                  setIsLoading(true);
                                }}
                              >
                                <Eye size={18} className="mr-3" />
                                View
                              </Button>
                              <Link
                                className={cn(
                                  buttonVariants({
                                    variant: 'secondary',
                                    className: 'w-full'
                                  })
                                )}
                                href={item.paper || ''}
                                // open new page
                                target="_blank"
                              >
                                <ScrollText size={18} className="mr-3" />
                                Download
                              </Link>
                            </div>

                            {/* <div className="bg-white p-5 rounded-md shadow-sm space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700">
                              Organization
                            </h3>
                            <p>{detail?.organization}</p>
                            <p>{detail?.address_of_organization}</p>
                          </div> */}

                            {/* <div className="bg-white p-5 rounded-md shadow-sm space-y-4">
                            <h3 className="text-xl font-semibold text-gray-700">
                              Paper
                            </h3>
                            <p>
                              <span className="font-semibold">Title: </span>
                              {detail?.title_of_paper}
                            </p>
                            <p>{detail?.abstract}</p>
                          </div> */}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
              <Dialog
                open={docUrl !== null}
                onOpenChange={(state) => {
                  if (!state) {
                    setDocUrl(null);
                  }
                }}
              >
                <DialogContent className="max-w-screen-xl h-full">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : null}
                  <iframe
                    src={`https://docs.google.com/viewer?url=${docUrl}&embedded=true`}
                    title="file"
                    width="100%"
                    height="100%"
                    onLoad={() => setIsLoading(false)}
                    loading="lazy"
                  />
                </DialogContent>
              </Dialog>
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

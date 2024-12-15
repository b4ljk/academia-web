'use client';
import LoadingOverlay from '@/components/main/LoadingOverlay';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { Paperclip } from 'lucide-react';
import { FileUploaderNoProp } from './add-file';

export interface ObjectType {
  $metadata: Metadata;
  Contents: Content[];
  IsTruncated: boolean;
  KeyCount: number;
  MaxKeys: number;
  Name: string;
  Prefix: string;
}

export interface Metadata {
  httpStatusCode: number;
  requestId: string;
  extendedRequestId: string;
  attempts: number;
  totalRetryDelay: number;
}

export interface Content {
  Key: string;
  LastModified: Date;
  ETag: string;
  Size: number;
  StorageClass: string;
}

export function FileList() {
  const { data, isLoading, refetch, isFetching } = useQuery<ObjectType>({
    queryKey: ['files'],
    queryFn: async () => {
      const response = await fetch('/api/file-list');
      return response.json();
    }
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg md:text-2xl">Uploaded Files</h1>
        <FileUploaderNoProp
          callback={refetch as any}
          title={'Upload file'}
        ></FileUploaderNoProp>
      </div>
      <Table className="min-h-[100px] relative">
        <LoadingOverlay isLoading={isFetching} />
        <TableCaption>A list of your files uploaded.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.Contents?.map((item, index) => (
            <TableRow key={item.Key}>
              <TableCell className="font-medium">{index}</TableCell>
              <TableCell>
                <span className="truncate">
                  {
                    // eslint-disable-next-line no-irregular-whitespace
                    item.Key.split('/')[1] || 'N/A'
                  }
                </span>
              </TableCell>
              <TableCell>
                {/* in MB */}
                {(item.Size / 1024 / 1024)?.toFixed(2)} MB
              </TableCell>
              <TableCell className="text-right">
                <a
                  href={`https://d2fdkqqxx3jf3.cloudfront.net/${item.Key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {
                    // eslint-disable-next-line no-irregular-whitespace
                    'https://d2fdkqqxx3jf3.cloudfront.net/' + item.Key
                  }
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

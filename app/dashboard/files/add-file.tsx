'use client';
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
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn, uploadFileViaXHR } from '@/lib/utils';
import { Paperclip, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export function FileUploaderNoProp({
  title,
  description,
  handleUpload,
  className,
  callback,
  children,
  icon = <UploadCloud />
}: {
  title: string;
  description?: string;
  handleUpload?: (data: any) => Promise<Response | void>;
  className?: string;
  callback?: () => Promise<void>;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const [file, setFile] = useState<File | null>();
  const fileSizeInMb = (file?.size ? file.size / 1024 / 1024 : 0).toFixed(2);
  const [open, setOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleInnerUpload = async () => {
    try {
      if (!file) return;
      setLoading(true);
      const response = await fetch(
        `/api/file-put?${new URLSearchParams({
          name: file.name,
          type: file.type,
          key: 'files/' + file.name
        })}`
      );

      if (!response) throw new Error('Алдаа гарлаа.');
      const json = (await response.json()) as {
        url: string;
        message: string;
      };

      const upload = await toast.promise(
        uploadFileViaXHR({
          file: file,
          setUploadProgress: setUploadProgress,
          uploadUrl: json.url
        }),
        {
          loading: 'Uploading...',
          success: 'Upload completed successfully',
          error: 'Upload failed'
        }
      );
      setOpen(false);
      setFile(null);
      setLoading(false);
      callback && callback();
    } catch (e) {
      // console.log(e);
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        onClick={() => {
          fileInput.current?.click();
        }}
        className={cn('flex items-center justify-center', className)}
      >
        <Paperclip className="mr-2 h-5 w-5" />
        Add file
      </Button>
      <input
        ref={fileInput}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setOpen(true);
          }
          e.target.value = '';
        }}
        // accept="application/pdf"
      />
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center">
          <Label className="col-span-1 text-md">File Name</Label>
          <Input readOnly value={file?.name} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center">
          <Label className="col-span-1 text-md">Size</Label>
          <Input readOnly value={fileSizeInMb + ' MB'} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center">
          <Label className="col-span-1 text-md">Type</Label>
          <Input readOnly value={file?.type} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center">
          <Label className="col-span-1 text-md">Progress</Label>
          <Progress
            value={uploadProgress ?? 1}
            className="bg-gray-200 col-span-3"
          />
        </div>
        {children}
        <DialogFooter>
          <Button
            variant={'secondary'}
            onClick={() => {
              setFile(null);
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleInnerUpload}
            type="submit"
            disabled={loading}
            loading={loading}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Trash } from 'lucide-react';
import { useState } from 'react';

interface CreateDialogProps {
  id?: string | number;
  onDelete?: (id: string) => void;
}

const DeleteFaq = ({ id, onDelete }: CreateDialogProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="destructive">
          <Trash size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this FAQ?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <Button>Cancel</Button>
          <Button
            onClick={() => {
              setOpen(false);
              if (id) {
                onDelete?.(String(id)); // Convert id to string
              }
            }}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFaq;

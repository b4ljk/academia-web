import { DatePicker } from '@/components/main/DatePicker';
import { InputWrapper } from '@/components/main/TextInput';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { importantDatesType } from '@/lib/schema-types';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface CreateDialogProps {
  onCreate?: (faq: importantDatesType) => void;
  onEdit?: (faq: importantDatesType) => void;
  id?: string | number;
  initialValue?: importantDatesType;
}

const CreateDate = ({
  onCreate,
  onEdit,
  id,
  initialValue
}: CreateDialogProps) => {
  const form = useForm<importantDatesType>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (initialValue) {
      form.reset(initialValue);
    }
  }, [initialValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="secondary" type="button">
          {onEdit ? <Pencil size={16} /> : 'Create Dates'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{onCreate ? 'Create Dates' : 'Edit Dates'}</DialogTitle>
        </DialogHeader>
        <InputWrapper
          className="col-span-1 lg:col-span-4"
          label="Title"
          error={form.formState.errors.title?.message}
        >
          <Input
            {...form.register('title', {
              required: 'Title is required'
            })}
            placeholder="Enter answer"
          />
        </InputWrapper>

        <InputWrapper
          className="col-span-1 lg:col-span-4"
          label="Pick a date"
          error={form.formState.errors.date?.message}
        >
          <Controller
            control={form.control}
            rules={{
              required: 'This field is required'
            }}
            name="date"
            render={({ field }) => {
              return (
                <DatePicker
                  value={field.value as any}
                  onChange={(date) =>
                    field.onChange(date?.toLocaleDateString())
                  }
                />
              );
            }}
          />
        </InputWrapper>

        <Button
          onClick={form.handleSubmit((data) => {
            console.log(data);
            if (onCreate) {
              onCreate(data);
            } else {
              onEdit?.(data);
            }
            setOpen(false);
          })}
        >
          {onCreate ? 'Create' : 'Update'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDate;

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
import { faqType } from '@/lib/schema-types';
import { Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface CreateDialogProps {
  onCreate?: (faq: faqType) => void;
  onEdit?: (faq: faqType) => void;
  id?: string | number;
  initialValue?: faqType;
}

const CreateFaq = ({
  onCreate,
  onEdit,
  id,
  initialValue
}: CreateDialogProps) => {
  const form = useForm();
  const [open, setOpen] = useState(false);
  const createFunc = (question: string, answer: string) => {
    onCreate?.({ question, answer });
  };

  const editFunc = (question: string, answer: string) => {
    onEdit?.({ question, answer, id: id ? Number(id) : undefined });
  };

  useEffect(() => {
    if (initialValue) {
      form.reset({
        question: initialValue.question,
        answer: initialValue.answer
      });
    }
  }, [initialValue]);

  // form.reset(initialValue);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="secondary" type="button">
          {onEdit ? <Pencil size={16} /> : 'Create FAQ'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{onCreate ? 'Create FAQ' : 'Edit FAQ'}</DialogTitle>
        </DialogHeader>
        <InputWrapper
          className="col-span-1 lg:col-span-4"
          label="Question"
          error={form.formState.errors.question?.message}
        >
          <Input {...form.register('question')} placeholder="Enter question" />
        </InputWrapper>
        <InputWrapper
          className="col-span-1 lg:col-span-4"
          label="Answer"
          error={form.formState.errors.answer?.message}
        >
          <Input {...form.register('answer')} placeholder="Enter answer" />
        </InputWrapper>

        <Button
          onClick={form.handleSubmit((data) => {
            if (onCreate) {
              createFunc(data.question, data.answer);
            } else {
              editFunc(data.question, data.answer);
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

export default CreateFaq;

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextInputProps {
  placeholder?: string;
  label?: string;
  className?: string;
}

const TextAreaInput = ({
  placeholder,
  label,
  className,
  ...rest
}: TextInputProps) => {
  return (
    <div className={cn('flex gap-2 flex-col', className)}>
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Textarea placeholder={placeholder} {...rest} />
    </div>
  );
};

export default TextAreaInput;

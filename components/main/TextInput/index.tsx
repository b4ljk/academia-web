import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  placeholder?: string;
  label?: string;
  className?: string;
}

const TextInput = ({
  value,
  onChange,
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
      <Input {...rest} />
    </div>
  );
};

export const InputWrapper = ({
  children,
  label,
  className,
  error,
  required
}: {
  children: ReactNode;
  label?: string;
  className?: string;
  error?: any;
  required?: boolean;
}) => (
  <div className={cn('flex gap-2 flex-col', className)}>
    <label className="text-sm font-medium text-muted-foreground">
      {label}
      {required && <span className="text-red-600">*</span>}
    </label>
    {children}
    {/* error state */}
    <p className="text-sm font-medium text-red-500">{error}</p>
  </div>
);

export default TextInput;

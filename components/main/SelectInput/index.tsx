import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface OptionType {
  value: string;
  label: string;
}

const SelectInput = ({
  value,
  onChange,
  label,
  options,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  options: OptionType[];
  placeholder?: string;
}) => {
  return (
    <div className="flex gap-2 flex-col">
      <label className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <Select onValueChange={(value) => onChange(value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder || 'Select'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectInput;

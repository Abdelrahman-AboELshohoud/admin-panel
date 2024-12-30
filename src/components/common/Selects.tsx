import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

export default function Selects({
  placeholder,
  options,
  value,
  isEditing,
  onChange,
}: {
  placeholder: string;
  options: any[];
  value: any;
  isEditing?: boolean;
  onChange?: (e: any) => void;
}) {
  return (
    <Select
      disabled={!isEditing || false}
      onValueChange={onChange}
      value={value}
    >
      <SelectTrigger
        defaultValue={value}
        className="w-[200px] custom-input text-white"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-[#3A3A3C] border-[#48484A] text-white">
        {options && options.length > 0 &&
          options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

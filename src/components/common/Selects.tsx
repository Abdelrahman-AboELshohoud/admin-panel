import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";

export default function Selects ({
    placeholder,
    options,
    value,
  }: {
    placeholder: string;
    options: string[];
    value: string;
  }) {
return (
      <Select>
      <SelectTrigger
        defaultValue={value}
        className="w-[200px] custom-input text-white"
        >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-[#3A3A3C] border-[#48484A] text-white">
        {options.map((option) => (
            <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
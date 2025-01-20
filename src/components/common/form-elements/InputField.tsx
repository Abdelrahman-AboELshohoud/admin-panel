import { Input } from "../../ui/input";

export default function InputField({
  label,
  value,
  isEditing,
  placeholder,
  className,
  onChange,
}: {
  label: string;
  value: any;
  isEditing: boolean;
  className?: string;
  placeholder?: string;
  onChange?: (e: any) => void;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <label className="text-gray-100 w-1/3">{label}</label>
      <Input
        value={value}
        readOnly={!isEditing}
        className="dark-input w-2/3"
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

import Selects from "./Selects";

export default function SelectsWithLabel({
  placeholder,
  options,
  value,
  label,
  isEditing,
  onChange,
}: {
  placeholder: string;
  options: any[];
  value: any;
  label: string;
  isEditing?: boolean;
  onChange?: (e: any) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <label className="text-gray-100">{label}</label>
      <Selects
        placeholder={placeholder}
        options={options}
        value={value}
        isEditing={isEditing}
        onChange={onChange}
      />
    </div>
  );
}

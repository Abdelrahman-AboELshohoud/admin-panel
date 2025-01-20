import Switch from "./Switch";

export default function SwitchWithLabel({
  label,
  checked,
  isEditing,
  onChange,
}: {
  label: string;
  checked: boolean;
  isEditing: boolean;
  onChange?: (e: any) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <label className="text-gray-100 w-1/3">{label}</label>
      <Switch checked={checked} disabled={!isEditing} onChange={onChange} />
    </div>
  );
}

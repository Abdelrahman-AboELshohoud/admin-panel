import Selects from "./Selects";

export default function SelectsWithLabel({
    placeholder,
    options,
    value,
    label,
  }: {
    placeholder: string;
    options: string[];
    value: string | number;
    label: string;
  }) {
    return (
    <div className="flex items-center justify-between gap-4">
      <label>{label}</label>
      <Selects
        placeholder={placeholder}
        options={options}
        value={value}
      />
    </div>
  );}
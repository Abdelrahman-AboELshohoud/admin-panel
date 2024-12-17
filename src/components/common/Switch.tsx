const Switch = ({
  checked,
  disabled,
}: {
  checked: boolean;
  disabled: boolean;
}) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        defaultValue=""
        disabled={disabled}
        defaultChecked={checked}
      />
      <div className="group peer bg-[#282828] rounded-full duration-300 w-16 h-8 ring-2 ring-quaternary after:duration-300 after:bg-quaternary peer-checked:after:bg-[#c0a82d] peer-checked:ring-[#c0a82d] after:rounded-full after:absolute after:h-6 after:w-6 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95" />
    </label>
  );
};

export default Switch;

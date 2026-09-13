import { ChevronDown } from "lucide-react";

const SelectField = ({
  label,
  name,
  options = [],
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />}
        <select
          id={name}
          name={name}
          {...props}
          className={`h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 ${Icon ? "pl-10" : ""} ${className}`}
        >
          {options.map((option) => {
            const optionValue = typeof option === "object" ? option.value : option;
            const optionLabel = typeof option === "object" ? option.label : option;

            return (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        <ChevronDown className="pointer-events-none absolute inset-y-0 right-3 h-4 w-4 self-center text-gray-400" aria-hidden="true" />
      </div>
    </div>
  );
};

export default SelectField;

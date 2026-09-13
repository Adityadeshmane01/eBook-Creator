const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  required = false,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`h-11 w-full rounded-xl border bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 ${Icon ? "pl-10" : ""} ${error ? "border-red-300" : "border-gray-200"}`}
          {...props}
        />
      </div>
      {error && (
        <p id={`${name}-error`} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;

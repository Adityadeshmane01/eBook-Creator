import { LoaderCircle } from "lucide-react";

const variants = {
  primary:
    "bg-linear-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-700 hover:to-purple-700 hover:shadow-violet-500/30",
  secondary:
    "border border-gray-200 bg-gray-100 text-gray-700 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900",
  danger: "bg-transparent text-red-600 hover:bg-red-50 hover:text-red-700",
};

const sizes = {
  sm: "h-9 rounded-lg px-3 text-sm",
  md: "h-11 rounded-xl px-4 text-sm",
  lg: "h-12 rounded-xl px-6 text-base",
};

const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  icon: Icon,
  className = "",
  type = "button",
  disabled,
  ...props
}) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant] ?? variants.primary} ${sizes[size] ?? sizes.md} ${className}`}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="h-4 w-4" aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

export default Button

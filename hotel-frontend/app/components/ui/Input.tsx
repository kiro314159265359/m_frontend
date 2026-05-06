import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-[13px] font-semibold text-gray-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            px-3.5 py-2.5 text-sm border rounded-xl bg-white text-gray-900 shadow-sm
            placeholder:text-gray-400 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500
            hover:border-gray-400
            disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none
            ${error ? "border-red-300 focus:ring-red-500/15 focus:border-red-500" : "border-gray-200"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500 animate-fade-in">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
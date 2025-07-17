import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ className, error, ...props }, ref) => {
  const baseStyles = "block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-reddit-orange focus:border-reddit-orange transition-colors duration-200";
  
  const errorStyles = error 
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300 hover:border-gray-400";
  
  return (
    <input
      ref={ref}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
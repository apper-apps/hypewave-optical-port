import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "md", children, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-reddit-orange to-reddit-light text-white hover:from-reddit-light hover:to-reddit-orange shadow-lg hover:shadow-xl focus:ring-reddit-orange",
    secondary: "bg-white text-reddit-orange border-2 border-reddit-orange hover:bg-reddit-orange hover:text-white shadow-md hover:shadow-lg focus:ring-reddit-orange",
    outline: "border-2 border-gray-300 text-gray-700 hover:border-reddit-orange hover:text-reddit-orange focus:ring-reddit-orange",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-reddit-orange focus:ring-reddit-orange"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
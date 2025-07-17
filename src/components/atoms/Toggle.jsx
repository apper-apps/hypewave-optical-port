import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Toggle = forwardRef(({ className, checked, onChange, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-reddit-orange focus:ring-offset-2",
        checked ? "bg-reddit-orange" : "bg-gray-200",
        className
      )}
      onClick={() => onChange(!checked)}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
});

Toggle.displayName = "Toggle";

export default Toggle;
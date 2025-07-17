import Label from "@/components/atoms/Label";
import Toggle from "@/components/atoms/Toggle";
import { cn } from "@/utils/cn";

const ToggleField = ({ 
  label, 
  checked, 
  onChange, 
  className, 
  ...props 
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Label className="mb-0">{label}</Label>
      <Toggle
        checked={checked}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default ToggleField;
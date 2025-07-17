import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  required = false, 
  error, 
  helperText, 
  className, 
  multiline = false,
  children,
  ...props 
}) => {
  const InputComponent = multiline ? Textarea : Input;
  
  return (
    <div className={cn("space-y-1", className)}>
      <Label required={required}>{label}</Label>
      {children || (
        <InputComponent
          type={type}
          error={error}
          {...props}
        />
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default FormField;
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className, 
  icon = "MessageSquare", 
  title = "No data found", 
  description = "Get started by creating your first item.", 
  actionLabel = "Get Started",
  onAction 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md p-12 text-center",
      className
    )}>
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-reddit-orange to-reddit-light rounded-full flex items-center justify-center">
        <ApperIcon name={icon} className="h-10 w-10 text-white" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {description}
      </p>
      {onAction && (
        <Button onClick={onAction} className="inline-flex items-center">
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;
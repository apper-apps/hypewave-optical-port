import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ className, message, onRetry }) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md p-8 text-center",
      className
    )}>
      <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">
        {message || "An unexpected error occurred. Please try again."}
      </p>
      {onRetry && (
        <Button onClick={onRetry} className="inline-flex items-center">
          <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;
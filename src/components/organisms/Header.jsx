import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ className, onToggleSidebar }) => {
  return (
    <header className={cn(
      "bg-white shadow-sm border-b border-gray-200 px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-reddit-orange transition-colors duration-200"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </button>
          <div className="flex items-center ml-4 lg:ml-0">
            <div className="w-8 h-8 bg-gradient-to-r from-reddit-orange to-reddit-light rounded-lg flex items-center justify-center">
              <ApperIcon name="Zap" className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">Hypewave AI</h1>
              <p className="text-sm text-gray-500">Reddit Comment Generator</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
            <ApperIcon name="Shield" className="h-4 w-4" />
            <span>Client-side processing</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
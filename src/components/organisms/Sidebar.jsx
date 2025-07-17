import { cn } from "@/utils/cn";
import NavItem from "@/components/molecules/NavItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className, isOpen, onClose }) => {
  const navItems = [
    { to: "/generator", icon: "MessageSquare", label: "Reddit Bulk Comment Generator" },
    { to: "/history", icon: "History", label: "History" },
    { to: "/transactions", icon: "CreditCard", label: "Transactions" },
    { to: "/settings", icon: "Settings", label: "Settings" }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-72 lg:w-72",
        className
      )}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-reddit-orange to-reddit-light rounded-lg flex items-center justify-center">
                  <ApperIcon name="Zap" className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-bold text-gray-900">Hypewave AI</h2>
                  <p className="text-sm text-gray-500">Comment Generator</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-reddit-orange transition-colors duration-200"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                className="w-full"
              >
                {item.label}
              </NavItem>
            ))}
          </nav>
          
          {/* Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center text-sm text-gray-500">
              <ApperIcon name="Shield" className="h-4 w-4 mr-2" />
              <span>All processing happens locally in your browser</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
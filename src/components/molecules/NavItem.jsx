import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavItem = ({ to, icon, children, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group relative",
          isActive 
            ? "bg-reddit-orange text-white shadow-lg" 
            : "text-gray-700 hover:bg-gray-100 hover:text-reddit-orange",
          className
        )
      }
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={icon} 
            className={cn(
              "h-5 w-5 mr-3 transition-colors duration-200",
              isActive ? "text-white" : "text-gray-500 group-hover:text-reddit-orange"
            )} 
          />
          <span className="font-medium">{children}</span>
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-reddit-light rounded-r-full" />
          )}
        </>
      )}
    </NavLink>
  );
};

export default NavItem;
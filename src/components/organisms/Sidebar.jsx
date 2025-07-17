import { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import NavItem from "@/components/molecules/NavItem";
import ApperIcon from "@/components/ApperIcon";
import { apiKeyService } from "@/services/api/apiKeyService";
const Sidebar = ({ className, isOpen, onClose }) => {
  const [openRouterStatus, setOpenRouterStatus] = useState('checking');
  const [scrapeOwlStatus, setScrapeOwlStatus] = useState('checking');
  const navItems = [
    { to: "/generator", icon: "MessageSquare", label: "Reddit Bulk Comment Generator" },
    { to: "/history", icon: "History", label: "History" },
    { to: "/transactions", icon: "CreditCard", label: "Transactions" },
    { to: "/settings", icon: "Settings", label: "Settings" }
  ];

const checkApiKeyStatus = async () => {
    const openRouterKey = apiKeyService.getOpenRouterKey();
    const scrapeOwlKey = apiKeyService.getScrapeOwlKey();
    
    // Check OpenRouter key
    if (!openRouterKey) {
      setOpenRouterStatus('not-set');
    } else {
      try {
        const isValid = await apiKeyService.validateOpenRouterKey(openRouterKey);
        setOpenRouterStatus(isValid ? 'valid' : 'invalid');
      } catch (error) {
        setOpenRouterStatus('invalid');
      }
    }
    
    // Check ScrapeOwl key
    if (!scrapeOwlKey) {
      setScrapeOwlStatus('not-set');
    } else {
      try {
        const isValid = await apiKeyService.validateScrapeOwlKey(scrapeOwlKey);
        setScrapeOwlStatus(isValid ? 'valid' : 'invalid');
      } catch (error) {
        setScrapeOwlStatus('invalid');
      }
    }
  };

  useEffect(() => {
    checkApiKeyStatus();
    
// Listen for localStorage changes to update status in real-time
    const handleStorageChange = (e) => {
      if (e.key === 'hypewave_openrouter_api_key' || e.key === 'hypewave_scrapeowl_api_key') {
        checkApiKeyStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

const getStatusDisplay = (status, service) => {
    switch (status) {
      case 'valid':
        return { text: `${service}: Valid`, icon: 'CheckCircle', color: 'text-green-600' };
      case 'invalid':
        return { text: `${service}: Invalid`, icon: 'XCircle', color: 'text-red-600' };
      case 'not-set':
        return { text: `${service}: Not Set`, icon: 'AlertCircle', color: 'text-amber-600' };
      default:
        return { text: `Checking ${service}...`, icon: 'Loader', color: 'text-gray-500' };
    }
  };

  const openRouterDisplay = getStatusDisplay(openRouterStatus, 'OpenRouter');
  const scrapeOwlDisplay = getStatusDisplay(scrapeOwlStatus, 'ScrapeOwl');

  const getBothKeysStatus = () => {
    if (openRouterStatus === 'valid' && scrapeOwlStatus === 'valid') {
      return { text: 'Both API Keys: Valid', icon: 'CheckCircle', color: 'text-green-600' };
    } else if (openRouterStatus === 'valid' || scrapeOwlStatus === 'valid') {
      return { text: 'One API Key Valid', icon: 'AlertCircle', color: 'text-amber-600' };
    } else if (openRouterStatus === 'not-set' && scrapeOwlStatus === 'not-set') {
      return { text: 'API Keys: Not Set', icon: 'AlertCircle', color: 'text-amber-600' };
    } else {
      return { text: 'API Keys: Invalid', icon: 'XCircle', color: 'text-red-600' };
    }
  };

  const combinedStatus = getBothKeysStatus();

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
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <ApperIcon name={combinedStatus.icon} className={`h-4 w-4 mr-2 ${combinedStatus.color}`} />
                <span className={combinedStatus.color}>{combinedStatus.text}</span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <ApperIcon name={openRouterDisplay.icon} className={`h-3 w-3 mr-1 ${openRouterDisplay.color}`} />
                <span className={openRouterDisplay.color}>OpenRouter</span>
                <span className="mx-2">•</span>
                <ApperIcon name={scrapeOwlDisplay.icon} className={`h-3 w-3 mr-1 ${scrapeOwlDisplay.color}`} />
                <span className={scrapeOwlDisplay.color}>ScrapeOwl</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
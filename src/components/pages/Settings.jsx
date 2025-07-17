import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiKeyService } from "@/services/api/apiKeyService";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Settings = () => {
  const [openRouterKey, setOpenRouterKey] = useState("");
  const [scrapeOwlKey, setScrapeOwlKey] = useState("");
  const [isValidatingOR, setIsValidatingOR] = useState(false);
  const [isValidatingSO, setIsValidatingSO] = useState(false);
  const [isValidOR, setIsValidOR] = useState(false);
  const [isValidSO, setIsValidSO] = useState(false);
useEffect(() => {
    const loadKeys = async () => {
      try {
        const savedORKey = await apiKeyService.getOpenRouterKey();
        const savedSOKey = await apiKeyService.getScrapeOwlKey();
        
        if (savedORKey) {
          setOpenRouterKey(savedORKey);
          // Re-validate stored keys to ensure they're still valid
          const isValid = await apiKeyService.validateOpenRouterKey(savedORKey);
          setIsValidOR(isValid);
          if (!isValid) {
            toast.warning("Stored OpenRouter API key is no longer valid. Please update it.");
          }
        }
        
        if (savedSOKey) {
          setScrapeOwlKey(savedSOKey);
          // Re-validate stored keys to ensure they're still valid
          const isValid = await apiKeyService.validateScrapeOwlKey(savedSOKey);
          setIsValidSO(isValid);
          if (!isValid) {
            toast.warning("Stored ScrapeOwl API key is no longer valid. Please update it.");
          }
        }
      } catch (error) {
        console.error("Error loading API keys:", error);
        toast.error("Error loading stored API keys. Please re-enter them.");
      }
    };
    
    loadKeys();
  }, []);
const validateOpenRouterKey = async (key) => {
    if (!key.trim()) {
      setIsValidOR(false);
      return;
    }

    setIsValidatingOR(true);
    try {
      const valid = await apiKeyService.validateOpenRouterKey(key);
      setIsValidOR(valid);
      
      if (valid) {
        await apiKeyService.saveOpenRouterKey(key);
        toast.success("OpenRouter API Key is valid and securely saved!");
      } else {
        toast.error("Invalid OpenRouter API Key. Please check and try again.");
      }
    } catch (error) {
      setIsValidOR(false);
      if (error.message.includes("Failed to securely store")) {
        toast.error("Error saving API key securely. Please try again.");
      } else {
        toast.error("Error validating OpenRouter API key. Please try again.");
      }
    } finally {
      setIsValidatingOR(false);
    }
  };

  const validateScrapeOwlKey = async (key) => {
    if (!key.trim()) {
      setIsValidSO(false);
      return;
    }

    setIsValidatingSO(true);
    try {
      const valid = await apiKeyService.validateScrapeOwlKey(key);
      setIsValidSO(valid);
      
      if (valid) {
        await apiKeyService.saveScrapeOwlKey(key);
        toast.success("ScrapeOwl API Key is valid and securely saved!");
      } else {
        toast.error("Invalid ScrapeOwl API Key. Please check and try again.");
      }
    } catch (error) {
      setIsValidSO(false);
      if (error.message.includes("Failed to securely store")) {
        toast.error("Error saving API key securely. Please try again.");
      } else {
        toast.error("Error validating ScrapeOwl API key. Please try again.");
      }
    } finally {
      setIsValidatingSO(false);
    }
  };

  const handleOpenRouterPaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText !== openRouterKey) {
      setTimeout(() => {
        validateOpenRouterKey(pastedText);
      }, 100);
    }
  };

  const handleScrapeOwlPaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText !== scrapeOwlKey) {
      setTimeout(() => {
        validateScrapeOwlKey(pastedText);
      }, 100);
    }
  };

const handleRemoveOpenRouter = () => {
    apiKeyService.removeOpenRouterKey();
    setOpenRouterKey("");
    setIsValidOR(false);
    toast.info("OpenRouter API Key removed successfully");
  };

  const handleRemoveScrapeOwl = () => {
    apiKeyService.removeScrapeOwlKey();
    setScrapeOwlKey("");
    setIsValidSO(false);
    toast.info("ScrapeOwl API Key removed successfully");
  };
  return (
<div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your API keys to enable comment generation</p>
      </div>

<div className="bg-white rounded-lg shadow-md p-6 space-y-8">
        {/* OpenRouter API Configuration */}
        <div>
          <div className="flex items-center mb-4">
            <ApperIcon name="Key" className="h-5 w-5 text-reddit-orange mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">OpenRouter API Configuration</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Enter your OpenRouter API key to enable AI comment generation. Your key is stored locally in your browser.
          </p>

          <div className="space-y-4">
            <FormField
              label="Your OpenRouter API Key"
              type="password"
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              onPaste={handleOpenRouterPaste}
              placeholder="sk-or-v1-..."
              helperText="Get your API key from https://openrouter.ai/keys"
            >
              <div className="relative">
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  onPaste={handleOpenRouterPaste}
                  placeholder="sk-or-v1-..."
                  className={cn(
                    "block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-reddit-orange focus:border-reddit-orange transition-colors duration-200",
                    isValidOR ? "border-green-500" : "border-gray-300"
                  )}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {isValidatingOR ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-reddit-orange"></div>
                  ) : isValidOR ? (
                    <ApperIcon name="CheckCircle" className="h-4 w-4 text-green-500" />
                  ) : openRouterKey && (
                    <ApperIcon name="XCircle" className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </FormField>

            {isValidOR && (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    OpenRouter API Key is valid and saved!
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRemoveOpenRouter}
                  className="flex items-center"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ScrapeOwl API Configuration */}
        <div>
          <div className="flex items-center mb-4">
            <ApperIcon name="Key" className="h-5 w-5 text-reddit-orange mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">ScrapeOwl API Configuration</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Enter your ScrapeOwl API key to enable Reddit data scraping. Your key is stored locally in your browser.
          </p>

          <div className="space-y-4">
            <FormField
              label="Your ScrapeOwl API Key"
              type="password"
              value={scrapeOwlKey}
              onChange={(e) => setScrapeOwlKey(e.target.value)}
              onPaste={handleScrapeOwlPaste}
              placeholder="Enter your ScrapeOwl API key..."
              helperText="Get your API key from https://scrapeowl.com/dashboard"
            >
              <div className="relative">
                <input
                  type="password"
                  value={scrapeOwlKey}
                  onChange={(e) => setScrapeOwlKey(e.target.value)}
                  onPaste={handleScrapeOwlPaste}
                  placeholder="Enter your ScrapeOwl API key..."
                  className={cn(
                    "block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-reddit-orange focus:border-reddit-orange transition-colors duration-200",
                    isValidSO ? "border-green-500" : "border-gray-300"
                  )}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {isValidatingSO ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-reddit-orange"></div>
                  ) : isValidSO ? (
                    <ApperIcon name="CheckCircle" className="h-4 w-4 text-green-500" />
                  ) : scrapeOwlKey && (
                    <ApperIcon name="XCircle" className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </FormField>

            {isValidSO && (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center">
                  <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">
                    ScrapeOwl API Key is valid and saved!
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleRemoveScrapeOwl}
                  className="flex items-center"
                >
                  <ApperIcon name="Trash2" className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>

<div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <ApperIcon name="Info" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">Important Notes:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your API keys are stored locally in your browser and never sent to our servers</li>
                <li>• Both OpenRouter and ScrapeOwl API keys are required for the Reddit tool to work</li>
                <li>• API keys are automatically validated when pasted</li>
                <li>• You'll need API credits in both your OpenRouter and ScrapeOwl accounts</li>
                <li>• The Reddit generator will be disabled until both valid API keys are saved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
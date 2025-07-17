import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiKeyService } from "@/services/api/apiKeyService";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Settings = () => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const savedKey = apiKeyService.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsValid(true);
    }
  }, []);

  const validateApiKey = async (key) => {
    if (!key.trim()) {
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    try {
      const valid = await apiKeyService.validateApiKey(key);
      setIsValid(valid);
      
      if (valid) {
        apiKeyService.saveApiKey(key);
        toast.success("API Key is valid and saved!");
      } else {
        toast.error("Invalid API Key. Please check and try again.");
      }
    } catch (error) {
      setIsValid(false);
      toast.error("Error validating API key. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = () => {
    validateApiKey(apiKey);
  };

  const handleBlur = () => {
    if (apiKey !== apiKeyService.getApiKey()) {
      validateApiKey(apiKey);
    }
  };

  const handleRemove = () => {
    apiKeyService.removeApiKey();
    setApiKey("");
    setIsValid(false);
    toast.info("API Key removed successfully");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your API key to enable comment generation</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <ApperIcon name="Key" className="h-5 w-5 text-reddit-orange mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">OpenRouter API Configuration</h2>
          </div>
          <p className="text-sm text-gray-600">
            Enter your OpenRouter API key to enable AI comment generation. Your key is stored locally in your browser.
          </p>
        </div>

        <div className="space-y-4">
          <FormField
            label="Your OpenRouter API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onBlur={handleBlur}
            placeholder="sk-or-v1-..."
            helperText="Get your API key from https://openrouter.ai/keys"
            className="relative"
          >
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onBlur={handleBlur}
                placeholder="sk-or-v1-..."
                className={cn(
                  "block w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-reddit-orange focus:border-reddit-orange transition-colors duration-200",
                  isValid ? "border-green-500" : "border-gray-300"
                )}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                {isValidating ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-reddit-orange"></div>
                ) : isValid ? (
                  <ApperIcon name="CheckCircle" className="h-4 w-4 text-green-500" />
                ) : apiKey && (
                  <ApperIcon name="XCircle" className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
          </FormField>

          {isValid && (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
              <ApperIcon name="CheckCircle" className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">
                API Key is valid and saved!
              </span>
            </div>
          )}

          <div className="flex space-x-3">
            <Button
              onClick={handleSave}
              disabled={isValidating || !apiKey.trim()}
              className="flex items-center"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Validating...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="h-4 w-4 mr-2" />
                  Save & Validate
                </>
              )}
            </Button>
            
            {isValid && (
              <Button
                variant="secondary"
                onClick={handleRemove}
                className="flex items-center"
              >
                <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
                Remove Key
              </Button>
            )}
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-start">
            <ApperIcon name="Info" className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-1">Important Notes:</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your API key is stored locally in your browser and never sent to our servers</li>
                <li>• All AI processing happens through OpenRouter's API</li>
                <li>• You'll need API credits in your OpenRouter account to generate comments</li>
                <li>• The app will be disabled until a valid API key is saved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
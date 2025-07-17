import { encryptionService } from './encryptionService.js';

const OPENROUTER_API_KEY_STORAGE_KEY = "hypewave_openrouter_api_key";
const SCRAPEOWL_API_KEY_STORAGE_KEY = "hypewave_scrapeowl_api_key";
const OPENROUTER_VALIDATION_KEY = "hypewave_openrouter_validated";
const SCRAPEOWL_VALIDATION_KEY = "hypewave_scrapeowl_validated";

const isInIframe = () => {
  try {
    return window !== window.parent;
  } catch (e) {
    return true;
  }
};

const isValidKeyFormat = (key, type) => {
  if (type === 'openrouter') {
    return key.startsWith('sk-or-v1-') && key.length > 20;
  }
  if (type === 'scrapeowl') {
    return key.length > 10 && !key.includes(' ');
  }
  return false;
};

export const apiKeyService = {
  async validateOpenRouterKey(apiKey) {
    try {
      // In iframe (preview), use format validation only
      if (isInIframe()) {
        const isValidFormat = isValidKeyFormat(apiKey, 'openrouter');
        if (isValidFormat) {
          const validationData = {
            timestamp: Date.now(),
            validated: true
          };
          localStorage.setItem(OPENROUTER_VALIDATION_KEY, JSON.stringify(validationData));
        }
        return isValidFormat;
      }

      const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      
      const isValid = response.status === 200;
      
      // Store validation status with timestamp
      if (isValid) {
        const validationData = {
          timestamp: Date.now(),
          validated: true
        };
        localStorage.setItem(OPENROUTER_VALIDATION_KEY, JSON.stringify(validationData));
      }
      
      return isValid;
    } catch (error) {
      console.error("OpenRouter API key validation error:", error);
      
      // In iframe or fetch error, fallback to format validation
      if (isInIframe() || error.message.includes("Failed to fetch")) {
        const isValidFormat = isValidKeyFormat(apiKey, 'openrouter');
        if (isValidFormat) {
          const validationData = {
            timestamp: Date.now(),
            validated: true
          };
          localStorage.setItem(OPENROUTER_VALIDATION_KEY, JSON.stringify(validationData));
        }
        return isValidFormat;
      }
      
      return false;
    }
  },

async validateScrapeOwlKey(apiKey) {
    try {
      // In iframe (preview), use format validation only
      if (isInIframe()) {
        const isValidFormat = isValidKeyFormat(apiKey, 'scrapeowl');
        if (isValidFormat) {
          const validationData = {
            timestamp: Date.now(),
            validated: true
          };
          localStorage.setItem(SCRAPEOWL_VALIDATION_KEY, JSON.stringify(validationData));
        }
        return isValidFormat;
      }

      const response = await fetch("https://api.scrapeowl.com/v1/account", {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      
      const isValid = response.status === 200;
      
      // Store validation status with timestamp
      if (isValid) {
        const validationData = {
          timestamp: Date.now(),
          validated: true
        };
        localStorage.setItem(SCRAPEOWL_VALIDATION_KEY, JSON.stringify(validationData));
      }
      
      return isValid;
    } catch (error) {
      console.error("ScrapeOwl API key validation error:", error);
      
      // In iframe or fetch error, fallback to format validation
      if (isInIframe() || error.message.includes("Failed to fetch")) {
        const isValidFormat = isValidKeyFormat(apiKey, 'scrapeowl');
        if (isValidFormat) {
          const validationData = {
            timestamp: Date.now(),
            validated: true
          };
          localStorage.setItem(SCRAPEOWL_VALIDATION_KEY, JSON.stringify(validationData));
        }
        return isValidFormat;
      }
      
      return false;
    }
  },

  // Legacy method for backward compatibility
  async validateApiKey(apiKey) {
    return this.validateOpenRouterKey(apiKey);
  },

async saveOpenRouterKey(apiKey) {
    try {
      const encrypted = await encryptionService.encrypt(apiKey);
      localStorage.setItem(OPENROUTER_API_KEY_STORAGE_KEY, encrypted);
    } catch (error) {
      console.error("Failed to save OpenRouter API key:", error);
      throw new Error("Failed to securely store API key");
    }
  },

  async getOpenRouterKey() {
    try {
      const encrypted = localStorage.getItem(OPENROUTER_API_KEY_STORAGE_KEY);
      if (!encrypted) return null;
      
      const decrypted = await encryptionService.decrypt(encrypted);
      if (!decrypted) {
        // Corrupted or tampered data, remove it
        this.removeOpenRouterKey();
        return null;
      }
      
      return decrypted;
    } catch (error) {
      console.error("Failed to retrieve OpenRouter API key:", error);
      this.removeOpenRouterKey();
      return null;
    }
  },

  removeOpenRouterKey() {
    localStorage.removeItem(OPENROUTER_API_KEY_STORAGE_KEY);
    localStorage.removeItem(OPENROUTER_VALIDATION_KEY);
  },

  async saveScrapeOwlKey(apiKey) {
    try {
      const encrypted = await encryptionService.encrypt(apiKey);
      localStorage.setItem(SCRAPEOWL_API_KEY_STORAGE_KEY, encrypted);
    } catch (error) {
      console.error("Failed to save ScrapeOwl API key:", error);
      throw new Error("Failed to securely store API key");
    }
  },

  async getScrapeOwlKey() {
    try {
      const encrypted = localStorage.getItem(SCRAPEOWL_API_KEY_STORAGE_KEY);
      if (!encrypted) return null;
      
      const decrypted = await encryptionService.decrypt(encrypted);
      if (!decrypted) {
        // Corrupted or tampered data, remove it
        this.removeScrapeOwlKey();
        return null;
      }
      
      return decrypted;
    } catch (error) {
      console.error("Failed to retrieve ScrapeOwl API key:", error);
      this.removeScrapeOwlKey();
      return null;
    }
  },

  removeScrapeOwlKey() {
    localStorage.removeItem(SCRAPEOWL_API_KEY_STORAGE_KEY);
    localStorage.removeItem(SCRAPEOWL_VALIDATION_KEY);
  },

  async hasValidApiKeys() {
    try {
      const [openRouterKey, scrapeOwlKey] = await Promise.all([
        this.getOpenRouterKey(),
        this.getScrapeOwlKey()
      ]);
      
      if (!openRouterKey || !scrapeOwlKey) return false;
      
      // Check if keys were validated recently (within 24 hours)
      const orValidation = localStorage.getItem(OPENROUTER_VALIDATION_KEY);
      const soValidation = localStorage.getItem(SCRAPEOWL_VALIDATION_KEY);
      
      if (orValidation && soValidation) {
        const orData = JSON.parse(orValidation);
        const soData = JSON.parse(soValidation);
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        if (orData.validated && soData.validated && 
            orData.timestamp > oneDayAgo && soData.timestamp > oneDayAgo) {
          return true;
        }
      }
      
      // Re-validate if validation is stale
      const [isORValid, isSOValid] = await Promise.all([
        this.validateOpenRouterKey(openRouterKey),
        this.validateScrapeOwlKey(scrapeOwlKey)
      ]);
      
      return isORValid && isSOValid;
    } catch (error) {
      console.error("Error checking API key validity:", error);
      return false;
    }
  },

  // Legacy methods for backward compatibility
  async saveApiKey(apiKey) {
    return this.saveOpenRouterKey(apiKey);
  },

  async getApiKey() {
    return this.getOpenRouterKey();
  },

  removeApiKey() {
    this.removeOpenRouterKey();
  },

  async hasValidApiKey() {
    const key = await this.getOpenRouterKey();
    return !!key;
  }
};
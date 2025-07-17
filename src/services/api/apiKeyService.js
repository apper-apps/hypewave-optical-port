const OPENROUTER_API_KEY_STORAGE_KEY = "hypewave_openrouter_api_key";
const SCRAPEOWL_API_KEY_STORAGE_KEY = "hypewave_scrapeowl_api_key";

export const apiKeyService = {
async validateOpenRouterKey(apiKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error("OpenRouter API key validation error:", error);
      return false;
    }
  },

  async validateScrapeOwlKey(apiKey) {
    try {
      const response = await fetch("https://api.scrapeowl.com/v1/account", {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error("ScrapeOwl API key validation error:", error);
      return false;
    }
  },

  // Legacy method for backward compatibility
  async validateApiKey(apiKey) {
    return this.validateOpenRouterKey(apiKey);
  },

saveOpenRouterKey(apiKey) {
    localStorage.setItem(OPENROUTER_API_KEY_STORAGE_KEY, apiKey);
  },

  getOpenRouterKey() {
    return localStorage.getItem(OPENROUTER_API_KEY_STORAGE_KEY);
  },

  removeOpenRouterKey() {
    localStorage.removeItem(OPENROUTER_API_KEY_STORAGE_KEY);
  },

  saveScrapeOwlKey(apiKey) {
    localStorage.setItem(SCRAPEOWL_API_KEY_STORAGE_KEY, apiKey);
  },

  getScrapeOwlKey() {
    return localStorage.getItem(SCRAPEOWL_API_KEY_STORAGE_KEY);
  },

  removeScrapeOwlKey() {
    localStorage.removeItem(SCRAPEOWL_API_KEY_STORAGE_KEY);
  },

  hasValidApiKeys() {
    return !!(this.getOpenRouterKey() && this.getScrapeOwlKey());
  },

  // Legacy methods for backward compatibility
  saveApiKey(apiKey) {
    this.saveOpenRouterKey(apiKey);
  },

  getApiKey() {
    return this.getOpenRouterKey();
  },

  removeApiKey() {
    this.removeOpenRouterKey();
  },

  hasValidApiKey() {
    return !!this.getOpenRouterKey();
  }
};
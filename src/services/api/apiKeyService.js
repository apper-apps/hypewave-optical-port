const API_KEY_STORAGE_KEY = "hypewave_api_key";

export const apiKeyService = {
  async validateApiKey(apiKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error("API key validation error:", error);
      return false;
    }
  },

  saveApiKey(apiKey) {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  },

  getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  },

  removeApiKey() {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  },

  hasValidApiKey() {
    return !!this.getApiKey();
  }
};
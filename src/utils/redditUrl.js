export const isValidRedditUrl = (url) => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Check if it's a valid Reddit domain
    if (!hostname.includes("reddit.com")) {
      return false;
    }
    
    // Check if it's www.reddit.com or old.reddit.com
    if (hostname !== "www.reddit.com" && hostname !== "old.reddit.com") {
      return false;
    }
    
    // Check if it's a post URL (contains /comments/)
    if (!urlObj.pathname.includes("/comments/")) {
      return false;
    }
    
    // Check if it's not just a subreddit or user profile
    const pathParts = urlObj.pathname.split("/");
    if (pathParts.length < 5) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

export const cleanRedditUrl = (url) => {
  if (!url) return "";
  
  try {
    const urlObj = new URL(url);
    // Remove all query parameters
    urlObj.search = "";
    return urlObj.toString();
  } catch (error) {
    return url;
  }
};
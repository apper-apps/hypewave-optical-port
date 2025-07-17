import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiKeyService } from "@/services/api/apiKeyService";
import { commentService } from "@/services/api/commentService";
import { isValidRedditUrl, cleanRedditUrl } from "@/utils/redditUrl";
import FormField from "@/components/molecules/FormField";
import ToggleField from "@/components/molecules/ToggleField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
const RedditGenerator = () => {
  const navigate = useNavigate();
  const [hasValidApiKeys, setHasValidApiKeys] = useState(false);
  const [redditUrl, setRedditUrl] = useState("");
  const [numberOfComments, setNumberOfComments] = useState(1);
  const [additionalContext, setAdditionalContext] = useState("");
  const [includeExistingComments, setIncludeExistingComments] = useState(false);
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [urlError, setUrlError] = useState("");

useEffect(() => {
    setHasValidApiKeys(apiKeyService.hasValidApiKeys());
  }, []);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    const cleaned = cleanRedditUrl(url);
    setRedditUrl(cleaned);
    
    if (cleaned && !isValidRedditUrl(cleaned)) {
      setUrlError("Please enter a valid Reddit post URL");
    } else {
      setUrlError("");
    }
  };

const handleGenerate = async () => {
    if (!hasValidApiKeys) {
      toast.error("Please configure both OpenRouter and ScrapeOwl API keys in Settings first");
      navigate("/settings");
      return;
    }

    if (!redditUrl.trim()) {
      toast.error("Please enter a Reddit URL");
      return;
    }

    if (!isValidRedditUrl(redditUrl)) {
      toast.error("Please enter a valid Reddit post URL");
      return;
    }

    if (numberOfComments < 1 || numberOfComments > 50) {
      toast.error("Number of comments must be between 1 and 50");
      return;
    }

    setIsGenerating(true);
    try {
      const batch = await commentService.generateComments({
        redditUrl,
        numberOfComments,
        additionalContext,
        includeExistingComments,
        includeEmojis
      });

      toast.success(`Generated ${batch.totalCount} comments successfully!`);
      
      // Reset form
      setRedditUrl("");
      setNumberOfComments(1);
      setAdditionalContext("");
      setIncludeExistingComments(false);
      setIncludeEmojis(false);
      
      // Navigate to history
      navigate("/history");
    } catch (error) {
      toast.error("Failed to generate comments. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

if (!hasValidApiKeys) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <ApperIcon name="Key" className="h-8 w-8 text-yellow-600" />
          </div>
<h3 className="text-lg font-semibold text-gray-900 mb-2">
            API Keys Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please configure both OpenRouter and ScrapeOwl API keys to enable comment generation.
          </p>
          <Button
            onClick={() => navigate("/settings")}
            className="inline-flex items-center"
          >
            <ApperIcon name="Settings" className="h-4 w-4 mr-2" />
            Go to Settings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reddit Bulk Comment Generator</h1>
        <p className="text-gray-600">Generate authentic Reddit comments using AI</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <FormField
            label="Reddit Post URL"
            type="url"
            value={redditUrl}
onChange={handleUrlChange}
            error={urlError}
            placeholder="https://www.reddit.com/r/technology/comments/..."
            helperText={
              <span className="break-all">
                Enter the full desktop URL of a Reddit post. Shortened links are not supported. Example: https://www.reddit.com/r/technology/comments/1cukcw1/openai_disbands_team_focused_on_longterm_ai_risks/
              </span>
            }
          />

          <FormField
            label="Number of Comments"
            type="number"
            value={numberOfComments}
            onChange={(e) => setNumberOfComments(parseInt(e.target.value) || 1)}
            min="1"
            max="50"
            helperText="Enter how many comments you want to generate (Max: 50)"
          />

          <FormField
            label="Additional Context (Optional)"
            multiline
            rows={3}
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="Provide any additional context or instructions for the AI..."
            helperText="Optional context to help the AI generate more relevant comments"
          />

          <div className="space-y-4">
            <ToggleField
              label="Use existing post comments as context?"
              checked={includeExistingComments}
              onChange={setIncludeExistingComments}
            />

            <ToggleField
              label="Include emojis in generated comments?"
              checked={includeEmojis}
              onChange={setIncludeEmojis}
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !redditUrl.trim() || urlError}
              className="w-full flex items-center justify-center"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Comments...
                </>
              ) : (
                <>
                  <ApperIcon name="Sparkles" className="h-5 w-5 mr-2" />
                  Generate Comments
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <div className="flex items-start">
            <ApperIcon name="Info" className="h-5 w-5 text-gray-600 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-gray-800 mb-1">How it works:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• AI analyzes the Reddit post content and generates contextually relevant comments</li>
                <li>• Comments are designed to feel natural and authentic</li>
                <li>• All generated content is saved locally in your browser</li>
                <li>• You can view and export all generated comments from the History page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedditGenerator;
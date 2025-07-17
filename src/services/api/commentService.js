import { apiKeyService } from "./apiKeyService";

const COMMENTS_STORAGE_KEY = "hypewave_comments";

export const commentService = {
  async generateComments(options) {
    const { redditUrl, numberOfComments, additionalContext, includeExistingComments, includeEmojis } = options;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const comments = [];
    
    for (let i = 0; i < numberOfComments; i++) {
      const comment = {
        id: `comment_${Date.now()}_${i}`,
        content: this.generateMockComment(i, includeEmojis, additionalContext),
generatedAt: new Date().toISOString(),
        redditUrl,
        context: additionalContext || "",
        includesEmojis: includeEmojis,
        usedExistingComments: includeExistingComments
      };
      comments.push(comment);
    }
    
    const batch = {
      id: `batch_${Date.now()}`,
      redditUrl,
      comments,
      totalCount: numberOfComments,
      createdAt: new Date().toISOString(),
      additionalContext: additionalContext || ""
    };
    
    this.saveBatch(batch);
    return batch;
  },

  generateMockComment(index, includeEmojis, context) {
    const baseComments = [
      "This is a really insightful post! Thanks for sharing your perspective.",
      "I completely agree with your point about this topic. Well said!",
      "This reminds me of a similar experience I had last year.",
      "Great analysis! I hadn't considered this angle before.",
      "Thanks for the detailed explanation. This clarifies a lot of things.",
      "I have a different viewpoint on this, but I appreciate the discussion.",
      "This is exactly what I was looking for. Bookmarking for later!",
      "Solid advice here. I'll definitely try implementing this.",
      "The way you explained this makes perfect sense. Thank you!",
      "This post deserves more upvotes. Quality content right here."
    ];
    
    let comment = baseComments[index % baseComments.length];
    
    if (context) {
      comment = `Regarding ${context.toLowerCase()}: ${comment}`;
    }
    
    if (includeEmojis) {
      const emojis = ["👍", "🔥", "💯", "👏", "🎯", "✨", "🚀", "💪", "🙌", "👌"];
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      comment += ` ${randomEmoji}`;
    }
    
    return comment;
  },

  saveBatch(batch) {
    const existingBatches = this.getAllBatches();
    existingBatches.push(batch);
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(existingBatches));
  },

  getAllBatches() {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  getAllComments() {
    const batches = this.getAllBatches();
    return batches.flatMap(batch => batch.comments);
  },

  exportAllData() {
    const batches = this.getAllBatches();
    const exportData = {
      exportedAt: new Date().toISOString(),
      totalBatches: batches.length,
      totalComments: batches.reduce((sum, batch) => sum + batch.comments.length, 0),
      batches
    };
    
    return JSON.stringify(exportData, null, 2);
  },

  clearAllData() {
    localStorage.removeItem(COMMENTS_STORAGE_KEY);
  }
};
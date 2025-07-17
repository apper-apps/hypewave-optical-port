import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { commentService } from "@/services/api/commentService";
import { format } from "date-fns";
import CommentCard from "@/components/molecules/CommentCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const History = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const data = commentService.getAllBatches();
      setBatches(data);
    } catch (err) {
      setError("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const exportData = commentService.exportAllData();
      const blob = new Blob([exportData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hypewave-comments-${format(new Date(), "yyyy-MM-dd-HHmm")}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("History exported successfully!");
    } catch (error) {
      toast.error("Failed to export history");
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history? This action cannot be undone.")) {
      commentService.clearAllData();
      setBatches([]);
      toast.success("History cleared successfully!");
    }
  };

  if (loading) {
    return <Loading type="cards" className="max-w-4xl mx-auto" />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Error message={error} onRetry={loadHistory} />
      </div>
    );
  }

  const totalComments = batches.reduce((sum, batch) => sum + batch.totalCount, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">History</h1>
            <p className="text-gray-600">
              {totalComments > 0 
                ? `${totalComments} comments generated across ${batches.length} batches`
                : "No comments generated yet"
              }
            </p>
          </div>
          
          {batches.length > 0 && (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleClearHistory}
                className="flex items-center"
              >
                <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
                Clear History
              </Button>
              <Button
                onClick={handleExport}
                className="flex items-center"
              >
                <ApperIcon name="Download" className="h-4 w-4 mr-2" />
                Export All as JSON
              </Button>
            </div>
          )}
        </div>

        {batches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-reddit-orange rounded-lg flex items-center justify-center">
                  <ApperIcon name="MessageSquare" className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Comments</p>
                  <p className="text-2xl font-bold text-gray-900">{totalComments}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-reddit-blue rounded-lg flex items-center justify-center">
                  <ApperIcon name="Package" className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Batches</p>
                  <p className="text-2xl font-bold text-gray-900">{batches.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-reddit-light rounded-lg flex items-center justify-center">
                  <ApperIcon name="Calendar" className="h-5 w-5 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Last Generated</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {batches.length > 0 
                      ? format(new Date(batches[0].createdAt), "MMM d")
                      : "Never"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {batches.length === 0 ? (
        <Empty
          icon="MessageSquare"
          title="No comments generated yet"
          description="Start by generating your first batch of Reddit comments using the generator tool."
          actionLabel="Generate Comments"
          onAction={() => window.location.href = "/generator"}
        />
      ) : (
        <div className="space-y-8">
          {batches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Batch from {format(new Date(batch.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <ApperIcon name="MessageSquare" className="h-4 w-4 mr-1" />
                      {batch.totalCount} comments
                    </div>
                    <div className="flex items-center">
                      <ApperIcon name="ExternalLink" className="h-4 w-4 mr-1" />
                      <span className="truncate max-w-xs">{batch.redditUrl}</span>
                    </div>
                    {batch.additionalContext && (
                      <div className="flex items-center">
                        <ApperIcon name="Tag" className="h-4 w-4 mr-1" />
                        <span className="truncate max-w-xs">{batch.additionalContext}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batch.comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
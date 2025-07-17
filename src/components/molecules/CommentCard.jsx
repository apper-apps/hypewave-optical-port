import { format } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const CommentCard = ({ comment, className }) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
          {format(new Date(comment.generatedAt), "MMM d, yyyy 'at' h:mm a")}
        </div>
        <div className="flex items-center space-x-2">
          {comment.includesEmojis && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              <ApperIcon name="Smile" className="h-3 w-3 mr-1" />
              Emojis
            </span>
          )}
          {comment.usedExistingComments && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <ApperIcon name="MessageSquare" className="h-3 w-3 mr-1" />
              Context
            </span>
          )}
        </div>
      </div>
      
      <p className="text-gray-800 mb-4 leading-relaxed">
        {comment.content}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <ApperIcon name="ExternalLink" className="h-4 w-4 mr-2" />
          <span className="truncate max-w-xs">
            {comment.redditUrl}
          </span>
        </div>
        {comment.context && (
          <div className="flex items-center">
            <ApperIcon name="Tag" className="h-4 w-4 mr-2" />
            <span className="truncate max-w-xs">
              {comment.context}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "default" }) => {
  if (type === "cards") {
    return (
      <div className={cn("space-y-6", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <div className="w-32 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-16 h-6 bg-gray-300 rounded-full"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="w-full h-4 bg-gray-300 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-300 rounded"></div>
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <div className="w-48 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className={cn("bg-white rounded-lg shadow-md overflow-hidden", className)}>
        <div className="px-6 py-4 border-b border-gray-200 animate-pulse">
          <div className="w-32 h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                <div className="w-48 h-4 bg-gray-300 rounded"></div>
                <div className="w-16 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-reddit-orange"></div>
        <span className="text-gray-600">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
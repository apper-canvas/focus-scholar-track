import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className,
  type = "general"
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: "WifiOff",
          title: "Connection Error",
          description: "Please check your internet connection and try again."
        };
      case "notFound":
        return {
          icon: "Search",
          title: "No Results Found",
          description: "We couldn't find what you're looking for."
        };
      case "permission":
        return {
          icon: "Lock",
          title: "Access Denied",
          description: "You don't have permission to access this resource."
        };
      default:
        return {
          icon: "AlertTriangle",
          title: "Error",
          description: message
        };
    }
  };

  const { icon, title, description } = getErrorConfig();

  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} size={32} className="text-error-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 mb-6 max-w-md">{description}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;
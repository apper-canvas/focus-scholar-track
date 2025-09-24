import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data available", 
  description = "Get started by adding your first item",
  onAction,
  actionLabel = "Add New",
  icon = "Database",
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-20 h-20 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-secondary-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">{title}</h3>
      <p className="text-secondary-600 mb-8 max-w-md">{description}</p>
      
      {onAction && (
        <Button onClick={onAction} size="lg" className="shadow-lg">
          <ApperIcon name="Plus" size={18} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;
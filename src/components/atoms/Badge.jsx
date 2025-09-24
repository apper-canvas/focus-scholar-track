import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}) => {
  const variants = {
    default: "bg-secondary-100 text-secondary-800 border-secondary-200",
    primary: "bg-primary-100 text-primary-800 border-primary-200",
    success: "bg-success-100 text-success-800 border-success-200",
    warning: "bg-warning-100 text-warning-800 border-warning-200",
    error: "bg-error-100 text-error-800 border-error-200",
    accent: "bg-accent-100 text-accent-800 border-accent-200"
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
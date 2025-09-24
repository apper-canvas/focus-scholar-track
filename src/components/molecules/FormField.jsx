import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import ApperIcon from "@/components/ApperIcon";

const FormField = ({ 
  label, 
  error, 
  children, 
  required = false,
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error-600 flex items-center gap-1">
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

FormField.Input = ({ error, ...props }) => <Input error={error} {...props} />;
FormField.Select = ({ error, ...props }) => <Select error={error} {...props} />;
FormField.Textarea = ({ error, ...props }) => <Textarea error={error} {...props} />;

export default FormField;
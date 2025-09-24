import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";

const DataTableHeader = ({ 
  title, 
  searchValue, 
  onSearchChange, 
  onAdd, 
  addButtonText = "Add New",
  showAddButton = true,
  children,
  className 
}) => {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder={`Search ${title.toLowerCase()}...`}
          className="w-full sm:w-64"
        />
        
        {children}
        
        {showAddButton && onAdd && (
          <Button onClick={onAdd} className="whitespace-nowrap">
            <ApperIcon name="Plus" size={16} className="mr-2" />
            {addButtonText}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DataTableHeader;
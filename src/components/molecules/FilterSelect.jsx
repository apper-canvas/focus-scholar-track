import React from "react";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";

const FilterSelect = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "All",
  className 
}) => {
  return (
    <div className={className}>
      {label && <Label className="mb-2">{label}</Label>}
      <Select value={value} onChange={onChange}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default FilterSelect;
import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "general" }) => {
  const getStatusConfig = () => {
    switch (type) {
      case "enrollment":
        switch (status?.toLowerCase()) {
          case "active": return { variant: "success", text: "Active" };
          case "inactive": return { variant: "error", text: "Inactive" };
          case "pending": return { variant: "warning", text: "Pending" };
          case "graduated": return { variant: "primary", text: "Graduated" };
          default: return { variant: "default", text: status || "Unknown" };
        }
      case "assignment":
        switch (status?.toLowerCase()) {
          case "submitted": return { variant: "success", text: "Submitted" };
          case "pending": return { variant: "warning", text: "Pending" };
          case "overdue": return { variant: "error", text: "Overdue" };
          case "graded": return { variant: "primary", text: "Graded" };
          default: return { variant: "default", text: status || "Not Submitted" };
        }
      case "grade":
        if (typeof status === "number") {
          if (status >= 90) return { variant: "success", text: "A" };
          if (status >= 80) return { variant: "primary", text: "B" };
          if (status >= 70) return { variant: "warning", text: "C" };
          if (status >= 60) return { variant: "accent", text: "D" };
          return { variant: "error", text: "F" };
        }
        return { variant: "default", text: status || "N/A" };
      default:
        return { variant: "default", text: status || "Unknown" };
    }
  };

  const { variant, text } = getStatusConfig();
  
  return <Badge variant={variant}>{text}</Badge>;
};

export default StatusBadge;
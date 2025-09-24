import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "table" }) => {
  if (type === "table") {
    return (
      <div className={cn("bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden", className)}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 border-b border-secondary-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 bg-secondary-200 rounded shimmer w-20"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 bg-secondary-200 rounded shimmer w-16"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 bg-secondary-200 rounded shimmer w-24"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 bg-secondary-200 rounded shimmer w-12"></div>
                </th>
                <th className="px-6 py-4 text-left">
                  <div className="h-4 bg-secondary-200 rounded shimmer w-16"></div>
                </th>
                <th className="px-6 py-4 text-right">
                  <div className="h-4 bg-secondary-200 rounded shimmer w-16 ml-auto"></div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-secondary-200 rounded-full shimmer"></div>
                      <div className="ml-4 space-y-2">
                        <div className="h-4 bg-secondary-200 rounded shimmer w-32"></div>
                        <div className="h-3 bg-secondary-200 rounded shimmer w-20"></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-2">
                      <div className="h-4 bg-secondary-200 rounded shimmer w-36"></div>
                      <div className="h-3 bg-secondary-200 rounded shimmer w-24"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-secondary-200 rounded shimmer w-20"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-4 bg-secondary-200 rounded shimmer w-12"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-6 bg-secondary-200 rounded-full shimmer w-16"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="h-8 w-8 bg-secondary-200 rounded shimmer"></div>
                      <div className="h-8 w-8 bg-secondary-200 rounded shimmer"></div>
                      <div className="h-8 w-8 bg-secondary-200 rounded shimmer"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-secondary-200 p-6">
            <div className="space-y-4">
              <div className="h-6 bg-secondary-200 rounded shimmer w-3/4"></div>
              <div className="h-4 bg-secondary-200 rounded shimmer w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-secondary-200 rounded shimmer w-full"></div>
                <div className="h-3 bg-secondary-200 rounded shimmer w-4/5"></div>
                <div className="h-3 bg-secondary-200 rounded shimmer w-3/5"></div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <div className="h-6 bg-secondary-200 rounded-full shimmer w-16"></div>
                <div className="h-8 w-20 bg-secondary-200 rounded shimmer"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <span className="text-secondary-600 font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
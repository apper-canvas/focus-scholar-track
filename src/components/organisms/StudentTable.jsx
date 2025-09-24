import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";

const StudentTable = ({ students, onViewStudent, onEditStudent, onDeleteStudent, className }) => {
  if (!students || students.length === 0) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="Users" size={48} className="mx-auto text-secondary-300 mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 mb-2">No students found</h3>
        <p className="text-secondary-500">Get started by adding your first student.</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-secondary-200 overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Grade Level
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                GPA
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {students.map((student) => (
              <tr key={student.Id} className="table-hover">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-secondary-900">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-secondary-500">
                        ID: {student.studentId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-secondary-900">{student.email}</div>
                  <div className="text-sm text-secondary-500">{student.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-secondary-900">{student.gradeLevel}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={cn(
                    "text-sm font-semibold",
                    student.gpa >= 3.5 ? "text-success-600" :
                    student.gpa >= 3.0 ? "text-primary-600" :
                    student.gpa >= 2.5 ? "text-warning-600" : "text-error-600"
                  )}>
                    {student.gpa.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={student.status} type="enrollment" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewStudent(student)}
                    >
                      <ApperIcon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditStudent(student)}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteStudent(student)}
                      className="text-error-600 hover:text-error-700 hover:bg-error-50"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentTable;
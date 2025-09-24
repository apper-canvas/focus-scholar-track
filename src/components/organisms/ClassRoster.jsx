import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ClassRoster = ({ classData, students, onEnrollStudent, onRemoveStudent, className }) => {
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const enrolledStudents = students.filter(student => 
    classData.enrolledStudents?.includes(student.Id)
  );

  const availableStudents = students.filter(student => 
    !classData.enrolledStudents?.includes(student.Id)
  );

  const handleEnrollStudents = () => {
    selectedStudents.forEach(studentId => {
      onEnrollStudent(classData.Id, studentId);
    });
    setSelectedStudents([]);
    setShowEnrollModal(false);
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Users" size={20} className="text-primary-600" />
              <span>Class Roster - {classData.name}</span>
            </CardTitle>
            <Button
              onClick={() => setShowEnrollModal(true)}
              size="sm"
              className="whitespace-nowrap"
            >
              <ApperIcon name="UserPlus" size={16} className="mr-2" />
              Enroll Students
            </Button>
          </div>
          <div className="flex items-center space-x-4 text-sm text-secondary-600">
            <span>Course Code: {classData.code}</span>
            <span>Credits: {classData.credits}</span>
            <span>Enrolled: {enrolledStudents.length} students</span>
          </div>
        </CardHeader>
        <CardContent>
          {enrolledStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-secondary-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-secondary-700">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-700">Contact</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-700">Grade Level</th>
                    <th className="text-left py-3 px-4 font-medium text-secondary-700">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {enrolledStudents.map((student) => (
                    <tr key={student.Id} className="hover:bg-secondary-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-white">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-secondary-900">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-sm text-secondary-500">
                              ID: {student.studentId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-secondary-900">{student.email}</div>
                        <div className="text-sm text-secondary-500">{student.phone}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-secondary-900">
                        {student.gradeLevel}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={student.status} type="enrollment" />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveStudent(classData.Id, student.Id)}
                          className="text-error-600 hover:text-error-700 hover:bg-error-50"
                        >
                          <ApperIcon name="UserMinus" size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <ApperIcon name="Users" size={48} className="mx-auto text-secondary-300 mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No students enrolled</h3>
              <p className="text-secondary-500 mb-4">Get started by enrolling students in this class.</p>
              <Button onClick={() => setShowEnrollModal(true)}>
                <ApperIcon name="UserPlus" size={16} className="mr-2" />
                Enroll Students
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-lg font-semibold text-secondary-900">
                Enroll Students in {classData.name}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedStudents([]);
                }}
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {availableStudents.length > 0 ? (
                <div className="space-y-2">
                  {availableStudents.map((student) => (
                    <label
                      key={student.Id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.Id)}
                        onChange={() => toggleStudentSelection(student.Id)}
                        className="w-4 h-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                      />
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-white">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-secondary-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-secondary-500">
                          {student.gradeLevel} • {student.email}
                        </div>
                      </div>
                      <StatusBadge status={student.status} type="enrollment" />
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="Users" size={48} className="mx-auto text-secondary-300 mb-4" />
                  <p className="text-secondary-500">No available students to enroll</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-secondary-200">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEnrollModal(false);
                  setSelectedStudents([]);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEnrollStudents}
                disabled={selectedStudents.length === 0}
              >
                Enroll {selectedStudents.length} Student{selectedStudents.length !== 1 ? "s" : ""}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassRoster;
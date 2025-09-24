import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const GradeEntryForm = ({ students, assignments, onSaveGrade, className }) => {
  const [formData, setFormData] = useState({
    studentId: "",
    assignmentId: "",
    score: "",
    feedback: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = "Please select a student";
    if (!formData.assignmentId) newErrors.assignmentId = "Please select an assignment";
    if (!formData.score) {
      newErrors.score = "Score is required";
    } else if (isNaN(formData.score) || formData.score < 0 || formData.score > 100) {
      newErrors.score = "Score must be between 0 and 100";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const selectedAssignment = assignments.find(a => a.Id === parseInt(formData.assignmentId));
    const gradeData = {
      ...formData,
      studentId: parseInt(formData.studentId),
      assignmentId: parseInt(formData.assignmentId),
      score: parseFloat(formData.score),
      maxPoints: selectedAssignment?.maxPoints || 100,
      submissionDate: new Date().toISOString(),
      status: "graded"
    };
    
    onSaveGrade(gradeData);
    toast.success("Grade submitted successfully");
    
    // Reset form
    setFormData({
      studentId: "",
      assignmentId: "",
      score: "",
      feedback: ""
    });
    setErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const selectedAssignment = assignments.find(a => a.Id === parseInt(formData.assignmentId));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="Edit3" size={20} className="text-primary-600" />
          <span>Grade Entry</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Student" required error={errors.studentId}>
              <FormField.Select
                value={formData.studentId}
                onChange={(e) => handleInputChange("studentId", e.target.value)}
                error={errors.studentId}
              >
                <option value="">Select a student</option>
                {students.map((student) => (
                  <option key={student.Id} value={student.Id}>
                    {student.firstName} {student.lastName}
                  </option>
                ))}
              </FormField.Select>
            </FormField>
            
            <FormField label="Assignment" required error={errors.assignmentId}>
              <FormField.Select
                value={formData.assignmentId}
                onChange={(e) => handleInputChange("assignmentId", e.target.value)}
                error={errors.assignmentId}
              >
                <option value="">Select an assignment</option>
                {assignments.map((assignment) => (
                  <option key={assignment.Id} value={assignment.Id}>
                    {assignment.title}
                  </option>
                ))}
              </FormField.Select>
            </FormField>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Score" required error={errors.score}>
              <div className="relative">
                <FormField.Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.score}
                  onChange={(e) => handleInputChange("score", e.target.value)}
                  placeholder="Enter score"
                  error={errors.score}
                />
                {selectedAssignment && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary-500">
                    / {selectedAssignment.maxPoints}
                  </div>
                )}
              </div>
            </FormField>
            
            {selectedAssignment && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700">Assignment Details</label>
                <div className="p-3 bg-secondary-50 rounded-md">
                  <div className="text-sm font-medium text-secondary-900">{selectedAssignment.title}</div>
                  <div className="text-sm text-secondary-500">Max Points: {selectedAssignment.maxPoints}</div>
                  <div className="text-sm text-secondary-500">Type: {selectedAssignment.type}</div>
                </div>
              </div>
            )}
          </div>
          
          <FormField label="Feedback" error={errors.feedback}>
            <FormField.Textarea
              value={formData.feedback}
              onChange={(e) => handleInputChange("feedback", e.target.value)}
              placeholder="Optional feedback for the student"
              rows={3}
              error={errors.feedback}
            />
          </FormField>
          
          <div className="flex justify-end">
            <Button type="submit" className="min-w-32">
              <ApperIcon name="Save" size={16} className="mr-2" />
              Submit Grade
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GradeEntryForm;
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format } from "date-fns";

const StudentModal = ({ isOpen, onClose, student, mode = "view", onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gradeLevel: "",
    status: "active"
  });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (student) {
      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phone: student.phone || "",
        gradeLevel: student.gradeLevel || "",
        status: student.status || "active"
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gradeLevel: "",
        status: "active"
      });
    }
    setErrors({});
  }, [student, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.gradeLevel) newErrors.gradeLevel = "Grade level is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    onSave(formData);
    toast.success(student ? "Student updated successfully" : "Student created successfully");
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const tabs = [
    { id: "info", label: "Information", icon: "User" },
    { id: "grades", label: "Grades", icon: "BookOpen" },
    { id: "assignments", label: "Assignments", icon: "FileText" }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-secondary-200 bg-gradient-to-r from-primary-50 to-primary-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="User" size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary-900">
                  {mode === "create" ? "Add New Student" :
                   mode === "edit" ? "Edit Student" : "Student Details"}
                </h2>
                {student && (
                  <p className="text-secondary-600">
                    {student.firstName} {student.lastName}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-secondary-200 bg-secondary-50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "text-primary-700 border-b-2 border-primary-600 bg-white"
                    : "text-secondary-600 hover:text-secondary-900"
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === "info" && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="First Name" required error={errors.firstName}>
                    <FormField.Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                      error={errors.firstName}
                      disabled={mode === "view"}
                    />
                  </FormField>
                  
                  <FormField label="Last Name" required error={errors.lastName}>
                    <FormField.Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                      error={errors.lastName}
                      disabled={mode === "view"}
                    />
                  </FormField>
                  
                  <FormField label="Email" required error={errors.email}>
                    <FormField.Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter email address"
                      error={errors.email}
                      disabled={mode === "view"}
                    />
                  </FormField>
                  
                  <FormField label="Phone" error={errors.phone}>
                    <FormField.Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      error={errors.phone}
                      disabled={mode === "view"}
                    />
                  </FormField>
                  
                  <FormField label="Grade Level" required error={errors.gradeLevel}>
                    <FormField.Select
                      value={formData.gradeLevel}
                      onChange={(e) => handleInputChange("gradeLevel", e.target.value)}
                      error={errors.gradeLevel}
                      disabled={mode === "view"}
                    >
                      <option value="">Select grade level</option>
                      <option value="9th Grade">9th Grade</option>
                      <option value="10th Grade">10th Grade</option>
                      <option value="11th Grade">11th Grade</option>
                      <option value="12th Grade">12th Grade</option>
                    </FormField.Select>
                  </FormField>
                  
                  <FormField label="Status" error={errors.status}>
                    <FormField.Select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      error={errors.status}
                      disabled={mode === "view"}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                      <option value="graduated">Graduated</option>
                    </FormField.Select>
                  </FormField>
                </div>

                {student && mode === "view" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-secondary-200">
                    <div>
                      <label className="text-sm font-medium text-secondary-700">Student ID</label>
                      <p className="text-sm text-secondary-900 mt-1">{student.studentId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-700">GPA</label>
                      <p className="text-sm font-semibold text-primary-600 mt-1">{student.gpa?.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-700">Enrollment Date</label>
                      <p className="text-sm text-secondary-900 mt-1">
                        {student.enrollmentDate ? format(new Date(student.enrollmentDate), "MMM d, yyyy") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-secondary-700">Current Status</label>
                      <div className="mt-1">
                        <StatusBadge status={student.status} type="enrollment" />
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}

            {activeTab === "grades" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">Academic Performance</h3>
                {student ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary-600">{student.gpa?.toFixed(2)}</div>
                        <div className="text-sm text-secondary-500">Current GPA</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-success-600">A-</div>
                        <div className="text-sm text-secondary-500">Average Grade</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-accent-600">85%</div>
                        <div className="text-sm text-secondary-500">Completion Rate</div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <p className="text-secondary-500 text-center py-8">No grade information available</p>
                )}
              </div>
            )}

            {activeTab === "assignments" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-secondary-900">Recent Assignments</h3>
                {student ? (
                  <div className="space-y-3">
                    {[
                      { title: "Mathematics Quiz 3", course: "Algebra II", score: 92, status: "graded" },
                      { title: "Science Lab Report", course: "Chemistry", score: null, status: "submitted" },
                      { title: "History Essay", course: "World History", score: null, status: "pending" }
                    ].map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-secondary-900">{assignment.title}</h4>
                          <p className="text-sm text-secondary-500">{assignment.course}</p>
                        </div>
                        <div className="text-right">
                          {assignment.score && (
                            <div className="text-lg font-semibold text-primary-600 mb-1">
                              {assignment.score}%
                            </div>
                          )}
                          <StatusBadge status={assignment.status} type="assignment" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary-500 text-center py-8">No assignment information available</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-secondary-200 bg-secondary-50">
            <Button variant="secondary" onClick={onClose}>
              {mode === "view" ? "Close" : "Cancel"}
            </Button>
            {mode !== "view" && (
              <Button type="submit" onClick={handleSubmit}>
                <ApperIcon name="Save" size={16} className="mr-2" />
                {student ? "Update Student" : "Create Student"}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StudentModal;
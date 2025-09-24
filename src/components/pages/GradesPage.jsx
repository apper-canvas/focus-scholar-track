import React, { useState } from "react";
import { useGrades } from "@/hooks/useGrades";
import { useStudents } from "@/hooks/useStudents";
import { useAssignments } from "@/hooks/useAssignments";
import Header from "@/components/organisms/Header";
import GradeEntryForm from "@/components/organisms/GradeEntryForm";
import DataTableHeader from "@/components/molecules/DataTableHeader";
import StatusBadge from "@/components/molecules/StatusBadge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const GradesPage = () => {
  const { grades, loading: gradesLoading, error: gradesError, createGrade, loadGrades } = useGrades();
  const { students, loading: studentsLoading } = useStudents();
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const [searchQuery, setSearchQuery] = useState("");

  const loading = gradesLoading || studentsLoading || assignmentsLoading;
  const error = gradesError;

  const getStudentName = (studentId) => {
    const student = students.find(s => s.Id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
  };

  const getAssignmentName = (assignmentId) => {
    const assignment = assignments.find(a => a.Id === assignmentId);
    return assignment ? assignment.title : "Unknown Assignment";
  };

  const filteredGrades = grades.filter(grade => {
    if (!searchQuery) return true;
    const studentName = getStudentName(grade.studentId).toLowerCase();
    const assignmentName = getAssignmentName(grade.assignmentId).toLowerCase();
    return studentName.includes(searchQuery.toLowerCase()) || 
           assignmentName.includes(searchQuery.toLowerCase());
  });

  const handleSaveGrade = async (gradeData) => {
    try {
      await createGrade(gradeData);
    } catch (error) {
      console.error("Error saving grade:", error);
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadGrades} />;

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTableHeader
          title="Grade Management"
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          showAddButton={false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grade Entry Form */}
          <div className="lg:col-span-1">
            <GradeEntryForm
              students={students}
              assignments={assignments}
              onSaveGrade={handleSaveGrade}
            />
          </div>

          {/* Grades List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="BarChart3" size={20} className="text-primary-600" />
                  <span>Recent Grades</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredGrades.length === 0 ? (
                  <Empty
                    title="No grades found"
                    description="Grades will appear here once you start entering them."
                    icon="BarChart3"
                  />
                ) : (
                  <div className="space-y-4">
                    {filteredGrades.map((grade) => (
                      <div key={grade.Id} className="flex items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-secondary-900">
                              {getStudentName(grade.studentId)}
                            </h4>
                            <div className="text-right">
                              <div className="text-lg font-bold text-primary-600">
                                {grade.score}%
                              </div>
                              <StatusBadge status={grade.status} type="assignment" />
                            </div>
                          </div>
                          <div className="text-sm text-secondary-600 mb-1">
                            Assignment: {getAssignmentName(grade.assignmentId)}
                          </div>
                          {grade.submissionDate && (
                            <div className="text-sm text-secondary-500">
                              Submitted: {format(new Date(grade.submissionDate), "MMM d, yyyy 'at' h:mm a")}
                            </div>
                          )}
                          {grade.feedback && (
                            <div className="text-sm text-secondary-600 mt-2 italic">
                              "{grade.feedback}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {grades.length}
              </div>
              <div className="text-sm text-secondary-600">Total Grades</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-success-600 mb-2">
                {grades.filter(g => g.score >= 90).length}
              </div>
              <div className="text-sm text-secondary-600">A Grades (90%+)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-600 mb-2">
                {grades.length > 0 ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-secondary-600">Average Score</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default GradesPage;
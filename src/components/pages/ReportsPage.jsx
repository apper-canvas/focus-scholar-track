import React, { useState, useMemo } from "react";
import { useStudents } from "@/hooks/useStudents";
import { useGrades } from "@/hooks/useGrades";
import { useCourses } from "@/hooks/useCourses";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ReportsPage = () => {
  const { students, loading: studentsLoading, error: studentsError, loadStudents } = useStudents();
  const { grades, loading: gradesLoading, error: gradesError } = useGrades();
  const { courses, loading: coursesLoading, error: coursesError } = useCourses();
  const [selectedReport, setSelectedReport] = useState("overview");

  const loading = studentsLoading || gradesLoading || coursesLoading;
  const error = studentsError || gradesError || coursesError;

  const reportData = useMemo(() => {
    if (!students.length || !grades.length || !courses.length) return null;

    const activeStudents = students.filter(s => s.status === "active");
    const totalGrades = grades.length;
    const averageGPA = students.reduce((sum, student) => sum + (student.gpa || 0), 0) / students.length;
    
    const gradeDistribution = {
      A: grades.filter(g => g.score >= 90).length,
      B: grades.filter(g => g.score >= 80 && g.score < 90).length,
      C: grades.filter(g => g.score >= 70 && g.score < 80).length,
      D: grades.filter(g => g.score >= 60 && g.score < 70).length,
      F: grades.filter(g => g.score < 60).length
    };

    const enrollmentByGrade = {
      "9th Grade": students.filter(s => s.gradeLevel === "9th Grade").length,
      "10th Grade": students.filter(s => s.gradeLevel === "10th Grade").length,
      "11th Grade": students.filter(s => s.gradeLevel === "11th Grade").length,
      "12th Grade": students.filter(s => s.gradeLevel === "12th Grade").length
    };

    return {
      totalStudents: students.length,
      activeStudents: activeStudents.length,
      totalCourses: courses.length,
      totalGrades,
      averageGPA: averageGPA.toFixed(2),
      gradeDistribution,
      enrollmentByGrade
    };
  }, [students, grades, courses]);

  const handleExportData = (type) => {
    let data = "";
    let filename = "";

    switch (type) {
      case "students":
        data = "First Name,Last Name,Email,Phone,Grade Level,GPA,Status\n" +
          students.map(s => 
            `${s.firstName},${s.lastName},${s.email},${s.phone},${s.gradeLevel},${s.gpa},${s.status}`
          ).join("\n");
        filename = "students_report.csv";
        break;
      case "grades":
        data = "Student ID,Assignment ID,Score,Status,Submission Date\n" +
          grades.map(g => 
            `${g.studentId},${g.assignmentId},${g.score},${g.status},${g.submissionDate}`
          ).join("\n");
        filename = "grades_report.csv";
        break;
      case "overview":
        data = `Scholar Track - Academic Overview Report
Generated: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
Total Students: ${reportData?.totalStudents || 0}
Active Students: ${reportData?.activeStudents || 0}
Total Courses: ${reportData?.totalCourses || 0}
Total Grades: ${reportData?.totalGrades || 0}
Average GPA: ${reportData?.averageGPA || 0}

GRADE DISTRIBUTION
A (90-100%): ${reportData?.gradeDistribution.A || 0}
B (80-89%): ${reportData?.gradeDistribution.B || 0}
C (70-79%): ${reportData?.gradeDistribution.C || 0}
D (60-69%): ${reportData?.gradeDistribution.D || 0}
F (0-59%): ${reportData?.gradeDistribution.F || 0}

ENROLLMENT BY GRADE LEVEL
9th Grade: ${reportData?.enrollmentByGrade["9th Grade"] || 0}
10th Grade: ${reportData?.enrollmentByGrade["10th Grade"] || 0}
11th Grade: ${reportData?.enrollmentByGrade["11th Grade"] || 0}
12th Grade: ${reportData?.enrollmentByGrade["12th Grade"] || 0}`;
        filename = "academic_overview_report.txt";
        break;
      default:
        return;
    }

    const blob = new Blob([data], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success(`${filename} downloaded successfully`);
  };

  const reportTypes = [
    { id: "overview", name: "Academic Overview", icon: "BarChart3" },
    { id: "students", name: "Student Details", icon: "Users" },
    { id: "grades", name: "Grade Analysis", icon: "BookOpen" },
    { id: "courses", name: "Course Enrollment", icon: "School" }
  ];

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Academic Reports</h1>
            <p className="text-secondary-600">Generate and export academic performance reports</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => handleExportData("overview")}
            >
              <ApperIcon name="FileText" size={16} className="mr-2" />
              Export Overview
            </Button>
            <Button onClick={() => handleExportData("students")}>
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export All Data
            </Button>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {reportTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedReport(type.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                selectedReport === type.id
                  ? "border-primary-600 bg-primary-50"
                  : "border-secondary-200 bg-white hover:border-primary-300 hover:bg-primary-25"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedReport === type.id ? "bg-primary-600" : "bg-secondary-100"
                }`}>
                  <ApperIcon 
                    name={type.icon} 
                    size={20} 
                    className={selectedReport === type.id ? "text-white" : "text-secondary-600"}
                  />
                </div>
                <span className={`font-medium ${
                  selectedReport === type.id ? "text-primary-900" : "text-secondary-900"
                }`}>
                  {type.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Report Content */}
        {selectedReport === "overview" && reportData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {reportData.totalStudents}
                  </div>
                  <div className="text-sm text-secondary-600">Total Students</div>
                  <div className="text-xs text-success-600 mt-1">
                    {reportData.activeStudents} Active
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-accent-600 mb-2">
                    {reportData.totalCourses}
                  </div>
                  <div className="text-sm text-secondary-600">Active Courses</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-success-600 mb-2">
                    {reportData.averageGPA}
                  </div>
                  <div className="text-sm text-secondary-600">Average GPA</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-warning-600 mb-2">
                    {reportData.totalGrades}
                  </div>
                  <div className="text-sm text-secondary-600">Total Grades</div>
                </CardContent>
              </Card>
            </div>

            {/* Grade Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportData.gradeDistribution).map(([grade, count]) => (
                      <div key={grade} className="flex items-center justify-between">
                        <span className="font-medium text-secondary-700">Grade {grade}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-secondary-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                grade === "A" ? "bg-success-600" :
                                grade === "B" ? "bg-primary-600" :
                                grade === "C" ? "bg-warning-600" :
                                grade === "D" ? "bg-accent-600" : "bg-error-600"
                              }`}
                              style={{ 
                                width: `${reportData.totalGrades > 0 ? (count / reportData.totalGrades) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-secondary-900 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enrollment by Grade Level */}
              <Card>
                <CardHeader>
                  <CardTitle>Enrollment by Grade Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(reportData.enrollmentByGrade).map(([grade, count]) => (
                      <div key={grade} className="flex items-center justify-between">
                        <span className="font-medium text-secondary-700">{grade}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-secondary-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-primary-600"
                              style={{ 
                                width: `${reportData.totalStudents > 0 ? (count / reportData.totalStudents) * 100 : 0}%` 
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-secondary-900 w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {selectedReport !== "overview" && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {reportTypes.find(t => t.id === selectedReport)?.name} Report
                </CardTitle>
                <Button
                  onClick={() => handleExportData(selectedReport)}
                  size="sm"
                >
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ApperIcon name="FileText" size={48} className="mx-auto text-secondary-300 mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">
                  Export {reportTypes.find(t => t.id === selectedReport)?.name}
                </h3>
                <p className="text-secondary-600 mb-6">
                  Click the export button above to download this report data.
                </p>
                <Button
                  onClick={() => handleExportData(selectedReport)}
                  variant="primary"
                >
                  <ApperIcon name="Download" size={16} className="mr-2" />
                  Export {reportTypes.find(t => t.id === selectedReport)?.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ReportsPage;
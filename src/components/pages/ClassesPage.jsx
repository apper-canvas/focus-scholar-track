import React, { useState } from "react";
import { useCourses } from "@/hooks/useCourses";
import { useStudents } from "@/hooks/useStudents";
import Header from "@/components/organisms/Header";
import ClassRoster from "@/components/organisms/ClassRoster";
import DataTableHeader from "@/components/molecules/DataTableHeader";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ClassesPage = () => {
  const { courses, loading: coursesLoading, error: coursesError, enrollStudent, removeStudent, loadCourses } = useCourses();
  const { students, loading: studentsLoading } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const loading = coursesLoading || studentsLoading;
  const error = coursesError;

  const filteredCourses = courses.filter(course =>
    !searchQuery ||
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEnrollStudent = async (courseId, studentId) => {
    try {
      await enrollStudent(courseId, studentId);
      toast.success("Student enrolled successfully");
    } catch (error) {
      toast.error("Failed to enroll student");
    }
  };

  const handleRemoveStudent = async (courseId, studentId) => {
    const student = students.find(s => s.Id === studentId);
    const course = courses.find(c => c.Id === courseId);
    
    if (window.confirm(`Remove ${student?.firstName} ${student?.lastName} from ${course?.name}?`)) {
      try {
        await removeStudent(courseId, studentId);
        toast.success("Student removed successfully");
      } catch (error) {
        toast.error("Failed to remove student");
      }
    }
  };

  const handleViewRoster = (course) => {
    setSelectedCourse(course);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadCourses} />;

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCourse ? (
          <>
            <DataTableHeader
              title="Classes"
              searchValue={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              showAddButton={false}
            />

            {filteredCourses.length === 0 ? (
              <Empty
                title="No classes found"
                description={searchQuery ? 
                  "No classes match your search criteria." :
                  "Classes will appear here when they are available."
                }
                icon="School"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.Id} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{course.name}</CardTitle>
                        <Badge variant="primary">{course.code}</Badge>
                      </div>
                      <div className="text-sm text-secondary-600">
                        {course.semester} • {course.credits} Credits
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ApperIcon name="Users" size={16} className="text-secondary-400" />
                            <span className="text-sm text-secondary-600">
                              {course.enrolledStudents?.length || 0} students enrolled
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleViewRoster(course)}
                          >
                            <ApperIcon name="Eye" size={16} className="mr-2" />
                            View Roster
                          </Button>
                          <div className="flex items-center space-x-2">
                            <Badge variant="accent">{course.credits} cr</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedCourse(null)}
                >
                  <ApperIcon name="ArrowLeft" size={16} className="mr-2" />
                  Back to Classes
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-secondary-900">
                    {selectedCourse.name}
                  </h1>
                  <p className="text-secondary-600">
                    {selectedCourse.code} • {selectedCourse.semester}
                  </p>
                </div>
              </div>
            </div>

            <ClassRoster
              classData={selectedCourse}
              students={students}
              onEnrollStudent={handleEnrollStudent}
              onRemoveStudent={handleRemoveStudent}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default ClassesPage;
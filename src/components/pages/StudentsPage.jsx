import React, { useState } from "react";
import { useStudents } from "@/hooks/useStudents";
import Header from "@/components/organisms/Header";
import StudentTable from "@/components/organisms/StudentTable";
import StudentModal from "@/components/organisms/StudentModal";
import DataTableHeader from "@/components/molecules/DataTableHeader";
import FilterSelect from "@/components/molecules/FilterSelect";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const StudentsPage = () => {
  const { students, loading, error, createStudent, updateStudent, deleteStudent, loadStudents } = useStudents();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "graduated", label: "Graduated" }
  ];

  const gradeOptions = [
    { value: "9th Grade", label: "9th Grade" },
    { value: "10th Grade", label: "10th Grade" },
    { value: "11th Grade", label: "11th Grade" },
    { value: "12th Grade", label: "12th Grade" }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchQuery || 
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || student.status === statusFilter;
    const matchesGrade = !gradeFilter || student.gradeLevel === gradeFilter;
    
    return matchesSearch && matchesStatus && matchesGrade;
  });

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await deleteStudent(student.Id);
        toast.success("Student deleted successfully");
      } catch (error) {
        toast.error("Failed to delete student");
      }
    }
  };

const handleSaveStudent = async (studentData) => {
    try {
      if (selectedStudent) {
        await updateStudent(selectedStudent.Id, studentData);
        toast.success("Student updated successfully");
      } else {
        await createStudent(studentData);
        toast.success("Student created successfully");
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Failed to save student");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DataTableHeader
          title="Students"
          searchValue={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onAdd={handleAddStudent}
          addButtonText="Add Student"
        >
          <div className="flex gap-3">
            <FilterSelect
              label=""
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={statusOptions}
              placeholder="All Statuses"
              className="w-32"
            />
            <FilterSelect
              label=""
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              options={gradeOptions}
              placeholder="All Grades"
              className="w-32"
            />
          </div>
        </DataTableHeader>

        {filteredStudents.length === 0 && !loading ? (
          <Empty
            title="No students found"
            description={searchQuery || statusFilter || gradeFilter ? 
              "Try adjusting your search criteria or filters." : 
              "Get started by adding your first student."
            }
            onAction={!searchQuery && !statusFilter && !gradeFilter ? handleAddStudent : undefined}
            actionLabel="Add First Student"
            icon="Users"
          />
        ) : (
          <StudentTable
            students={filteredStudents}
            onViewStudent={handleViewStudent}
            onEditStudent={handleEditStudent}
            onDeleteStudent={handleDeleteStudent}
          />
        )}

        <StudentModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          student={selectedStudent}
          mode={modalMode}
          onSave={handleSaveStudent}
        />
      </main>
    </div>
  );
};

export default StudentsPage;
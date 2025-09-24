import { useState, useEffect } from "react";
import { studentsApi } from "@/services/api/studentsApi";

export const useStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentsApi.getAll();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students");
      console.error("Error loading students:", err);
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (studentData) => {
    try {
      const newStudent = await studentsApi.create(studentData);
      setStudents(prev => [...prev, newStudent]);
      return newStudent;
    } catch (err) {
      setError("Failed to create student");
      throw err;
    }
  };

  const updateStudent = async (id, studentData) => {
    try {
      const updatedStudent = await studentsApi.update(id, studentData);
      if (updatedStudent) {
        setStudents(prev => prev.map(s => s.Id === id ? updatedStudent : s));
        return updatedStudent;
      }
    } catch (err) {
      setError("Failed to update student");
      throw err;
    }
  };

  const deleteStudent = async (id) => {
    try {
      const success = await studentsApi.delete(id);
      if (success) {
        setStudents(prev => prev.filter(s => s.Id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete student");
      throw err;
    }
  };

  const searchStudents = async (query) => {
    try {
      setLoading(true);
      setError("");
      const data = await studentsApi.search(query);
      setStudents(data);
    } catch (err) {
      setError("Failed to search students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  return {
    students,
    loading,
    error,
    loadStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents
  };
};
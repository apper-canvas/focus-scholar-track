import { useState, useEffect } from "react";
import { coursesApi } from "@/services/api/coursesApi";

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await coursesApi.getAll();
      setCourses(data);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData) => {
    try {
      const newCourse = await coursesApi.create(courseData);
      setCourses(prev => [...prev, newCourse]);
      return newCourse;
    } catch (err) {
      setError("Failed to create course");
      throw err;
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      const updatedCourse = await coursesApi.update(id, courseData);
      if (updatedCourse) {
        setCourses(prev => prev.map(c => c.Id === id ? updatedCourse : c));
        return updatedCourse;
      }
    } catch (err) {
      setError("Failed to update course");
      throw err;
    }
  };

  const deleteCourse = async (id) => {
    try {
      const success = await coursesApi.delete(id);
      if (success) {
        setCourses(prev => prev.filter(c => c.Id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete course");
      throw err;
    }
  };

  const enrollStudent = async (courseId, studentId) => {
    try {
      const updatedCourse = await coursesApi.enrollStudent(courseId, studentId);
      if (updatedCourse) {
        setCourses(prev => prev.map(c => c.Id === courseId ? updatedCourse : c));
        return updatedCourse;
      }
    } catch (err) {
      setError("Failed to enroll student");
      throw err;
    }
  };

  const removeStudent = async (courseId, studentId) => {
    try {
      const updatedCourse = await coursesApi.removeStudent(courseId, studentId);
      if (updatedCourse) {
        setCourses(prev => prev.map(c => c.Id === courseId ? updatedCourse : c));
        return updatedCourse;
      }
    } catch (err) {
      setError("Failed to remove student");
      throw err;
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    loadCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    enrollStudent,
    removeStudent
  };
};
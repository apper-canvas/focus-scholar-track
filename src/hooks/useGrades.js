import { useState, useEffect } from "react";
import { gradesApi } from "@/services/api/gradesApi";

export const useGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGrades = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await gradesApi.getAll();
      setGrades(data);
    } catch (err) {
      setError("Failed to load grades");
      console.error("Error loading grades:", err);
    } finally {
      setLoading(false);
    }
  };

  const createGrade = async (gradeData) => {
    try {
      const newGrade = await gradesApi.create(gradeData);
      setGrades(prev => [...prev, newGrade]);
      return newGrade;
    } catch (err) {
      setError("Failed to create grade");
      throw err;
    }
  };

  const updateGrade = async (id, gradeData) => {
    try {
      const updatedGrade = await gradesApi.update(id, gradeData);
      if (updatedGrade) {
        setGrades(prev => prev.map(g => g.Id === id ? updatedGrade : g));
        return updatedGrade;
      }
    } catch (err) {
      setError("Failed to update grade");
      throw err;
    }
  };

  const deleteGrade = async (id) => {
    try {
      const success = await gradesApi.delete(id);
      if (success) {
        setGrades(prev => prev.filter(g => g.Id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete grade");
      throw err;
    }
  };

  const getGradesByStudent = async (studentId) => {
    try {
      const data = await gradesApi.getByStudent(studentId);
      return data;
    } catch (err) {
      setError("Failed to load student grades");
      throw err;
    }
  };

  useEffect(() => {
    loadGrades();
  }, []);

  return {
    grades,
    loading,
    error,
    loadGrades,
    createGrade,
    updateGrade,
    deleteGrade,
    getGradesByStudent
  };
};
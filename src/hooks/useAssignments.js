import { useState, useEffect } from "react";
import { assignmentsApi } from "@/services/api/assignmentsApi";

export const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await assignmentsApi.getAll();
      setAssignments(data);
    } catch (err) {
      setError("Failed to load assignments");
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const createAssignment = async (assignmentData) => {
    try {
      const newAssignment = await assignmentsApi.create(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
      return newAssignment;
    } catch (err) {
      setError("Failed to create assignment");
      throw err;
    }
  };

  const updateAssignment = async (id, assignmentData) => {
    try {
      const updatedAssignment = await assignmentsApi.update(id, assignmentData);
      if (updatedAssignment) {
        setAssignments(prev => prev.map(a => a.Id === id ? updatedAssignment : a));
        return updatedAssignment;
      }
    } catch (err) {
      setError("Failed to update assignment");
      throw err;
    }
  };

  const deleteAssignment = async (id) => {
    try {
      const success = await assignmentsApi.delete(id);
      if (success) {
        setAssignments(prev => prev.filter(a => a.Id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete assignment");
      throw err;
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  return {
    assignments,
    loading,
    error,
    loadAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment
  };
};
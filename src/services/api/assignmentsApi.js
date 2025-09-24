import assignmentsData from "@/services/mockData/assignments.json";

let assignments = [...assignmentsData];

export const assignmentsApi = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return assignments.map(assignment => ({ ...assignment }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const assignment = assignments.find(a => a.Id === id);
    return assignment ? { ...assignment } : null;
  },

  async create(assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = assignments.length > 0 ? Math.max(...assignments.map(a => a.Id)) : 0;
    const newAssignment = {
      ...assignmentData,
      Id: maxId + 1
    };
    assignments.push(newAssignment);
    return { ...newAssignment };
  },

  async update(id, assignmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = assignments.findIndex(a => a.Id === id);
    if (index === -1) return null;
    
    assignments[index] = { ...assignments[index], ...assignmentData };
    return { ...assignments[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = assignments.findIndex(a => a.Id === id);
    if (index === -1) return false;
    
    assignments.splice(index, 1);
    return true;
  },

  async getByCourse(courseId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return assignments
      .filter(assignment => assignment.courseId === courseId)
      .map(assignment => ({ ...assignment }));
  },

  async getByType(type) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return assignments
      .filter(assignment => type === "" || assignment.type === type)
      .map(assignment => ({ ...assignment }));
  }
};
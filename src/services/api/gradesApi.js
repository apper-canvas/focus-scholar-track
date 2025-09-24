import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

export const gradesApi = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return grades.map(grade => ({ ...grade }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const grade = grades.find(g => g.Id === id);
    return grade ? { ...grade } : null;
  },

  async create(gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = grades.length > 0 ? Math.max(...grades.map(g => g.Id)) : 0;
    const newGrade = {
      ...gradeData,
      Id: maxId + 1
    };
    grades.push(newGrade);
    return { ...newGrade };
  },

  async update(id, gradeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = grades.findIndex(g => g.Id === id);
    if (index === -1) return null;
    
    grades[index] = { ...grades[index], ...gradeData };
    return { ...grades[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = grades.findIndex(g => g.Id === id);
    if (index === -1) return false;
    
    grades.splice(index, 1);
    return true;
  },

  async getByStudent(studentId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return grades
      .filter(grade => grade.studentId === studentId)
      .map(grade => ({ ...grade }));
  },

  async getByAssignment(assignmentId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return grades
      .filter(grade => grade.assignmentId === assignmentId)
      .map(grade => ({ ...grade }));
  },

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return grades
      .filter(grade => status === "" || grade.status === status)
      .map(grade => ({ ...grade }));
  }
};
import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

export const studentsApi = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return students.map(student => ({ ...student }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const student = students.find(s => s.Id === id);
    return student ? { ...student } : null;
  },

  async create(studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = students.length > 0 ? Math.max(...students.map(s => s.Id)) : 0;
    const newStudent = {
      ...studentData,
      Id: maxId + 1,
      studentId: `STU${String(maxId + 1).padStart(3, "0")}`,
      enrollmentDate: new Date().toISOString(),
      gpa: 0.0
    };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = students.findIndex(s => s.Id === id);
    if (index === -1) return null;
    
    students[index] = { ...students[index], ...studentData };
    return { ...students[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = students.findIndex(s => s.Id === id);
    if (index === -1) return false;
    
    students.splice(index, 1);
    return true;
  },

  async search(query) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const lowercaseQuery = query.toLowerCase();
    return students
      .filter(student => 
        student.firstName.toLowerCase().includes(lowercaseQuery) ||
        student.lastName.toLowerCase().includes(lowercaseQuery) ||
        student.email.toLowerCase().includes(lowercaseQuery) ||
        student.studentId.toLowerCase().includes(lowercaseQuery)
      )
      .map(student => ({ ...student }));
  },

  async filterByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return students
      .filter(student => status === "" || student.status === status)
      .map(student => ({ ...student }));
  },

  async filterByGradeLevel(gradeLevel) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return students
      .filter(student => gradeLevel === "" || student.gradeLevel === gradeLevel)
      .map(student => ({ ...student }));
  }
};
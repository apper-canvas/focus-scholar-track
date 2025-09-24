import coursesData from "@/services/mockData/courses.json";

let courses = [...coursesData];

export const coursesApi = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return courses.map(course => ({ ...course }));
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const course = courses.find(c => c.Id === id);
    return course ? { ...course } : null;
  },

  async create(courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = courses.length > 0 ? Math.max(...courses.map(c => c.Id)) : 0;
    const newCourse = {
      ...courseData,
      Id: maxId + 1,
      enrolledStudents: []
    };
    courses.push(newCourse);
    return { ...newCourse };
  },

  async update(id, courseData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = courses.findIndex(c => c.Id === id);
    if (index === -1) return null;
    
    courses[index] = { ...courses[index], ...courseData };
    return { ...courses[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = courses.findIndex(c => c.Id === id);
    if (index === -1) return false;
    
    courses.splice(index, 1);
    return true;
  },

  async enrollStudent(courseId, studentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const course = courses.find(c => c.Id === courseId);
    if (!course) return false;
    
    if (!course.enrolledStudents.includes(studentId)) {
      course.enrolledStudents.push(studentId);
    }
    return { ...course };
  },

  async removeStudent(courseId, studentId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const course = courses.find(c => c.Id === courseId);
    if (!course) return false;
    
    course.enrolledStudents = course.enrolledStudents.filter(id => id !== studentId);
    return { ...course };
  }
};
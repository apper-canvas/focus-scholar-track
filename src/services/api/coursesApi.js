import { toast } from 'react-toastify';

export const coursesApi = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "enrolled_students_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(course => ({
        Id: course.Id,
        name: course.name_c || '',
        code: course.code_c || '',
        semester: course.semester_c || '',
        credits: course.credits_c || 0,
        enrolledStudents: course.enrolled_students_c ? course.enrolled_students_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      }));
    } catch (error) {
      console.error("Error fetching courses:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "semester_c"}},
          {"field": {"Name": "credits_c"}},
          {"field": {"Name": "enrolled_students_c"}}
        ]
      };

      const response = await apperClient.getRecordById('course_c', id, params);
      
      if (!response?.data) {
        return null;
      }

      const course = response.data;
      return {
        Id: course.Id,
        name: course.name_c || '',
        code: course.code_c || '',
        semester: course.semester_c || '',
        credits: course.credits_c || 0,
        enrolledStudents: course.enrolled_students_c ? course.enrolled_students_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
      };
    } catch (error) {
      console.error(`Error fetching course ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: courseData.name,
          name_c: courseData.name,
          code_c: courseData.code,
          semester_c: courseData.semester,
          credits_c: courseData.credits,
          enrolled_students_c: ''
        }]
      };

      const response = await apperClient.createRecord('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} courses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdCourse = successful[0].data;
          return {
            Id: createdCourse.Id,
            name: createdCourse.name_c || '',
            code: createdCourse.code_c || '',
            semester: createdCourse.semester_c || '',
            credits: createdCourse.credits_c || 0,
            enrolledStudents: []
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating course:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, courseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: courseData.name,
          name_c: courseData.name,
          code_c: courseData.code,
          semester_c: courseData.semester,
          credits_c: courseData.credits,
          enrolled_students_c: courseData.enrolledStudents ? courseData.enrolledStudents.join(',') : ''
        }]
      };

      const response = await apperClient.updateRecord('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} courses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedCourse = successful[0].data;
          return {
            Id: updatedCourse.Id,
            name: updatedCourse.name_c || '',
            code: updatedCourse.code_c || '',
            semester: updatedCourse.semester_c || '',
            credits: updatedCourse.credits_c || 0,
            enrolledStudents: updatedCourse.enrolled_students_c ? updatedCourse.enrolled_students_c.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : []
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating course:", error?.response?.data?.message || error);
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('course_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} courses:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting course:", error?.response?.data?.message || error);
      return false;
    }
  },

  async enrollStudent(courseId, studentId) {
    try {
      // First get the current course
      const course = await this.getById(courseId);
      if (!course) return false;
      
      // Add student to enrolled list if not already present
      const enrolledStudents = course.enrolledStudents || [];
      if (!enrolledStudents.includes(studentId)) {
        enrolledStudents.push(studentId);
      }
      
      // Update the course
      const updatedCourse = await this.update(courseId, {
        ...course,
        enrolledStudents
      });
      
      return updatedCourse;
    } catch (error) {
      console.error("Error enrolling student:", error?.response?.data?.message || error);
      return false;
    }
  },

  async removeStudent(courseId, studentId) {
    try {
      // First get the current course
      const course = await this.getById(courseId);
      if (!course) return false;
      
      // Remove student from enrolled list
      const enrolledStudents = (course.enrolledStudents || []).filter(id => id !== studentId);
      
      // Update the course
      const updatedCourse = await this.update(courseId, {
        ...course,
        enrolledStudents
      });
      
      return updatedCourse;
    } catch (error) {
      console.error("Error removing student:", error?.response?.data?.message || error);
      return false;
    }
  }
};
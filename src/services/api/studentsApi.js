import { toast } from 'react-toastify';

export const studentsApi = {
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "gpa_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        studentId: student.student_id_c || '',
        email: student.email_c || '',
        phone: student.phone_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        status: student.status_c || 'active',
        gradeLevel: student.grade_level_c || '',
        gpa: student.gpa_c || 0.0
      }));
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "gpa_c"}}
        ]
      };

      const response = await apperClient.getRecordById('student_c', id, params);
      
      if (!response?.data) {
        return null;
      }

      const student = response.data;
      return {
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        studentId: student.student_id_c || '',
        email: student.email_c || '',
        phone: student.phone_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        status: student.status_c || 'active',
        gradeLevel: student.grade_level_c || '',
        gpa: student.gpa_c || 0.0
      };
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          student_id_c: studentData.studentId || `STU${Date.now()}`,
          email_c: studentData.email,
          phone_c: studentData.phone || '',
          enrollment_date_c: new Date().toISOString(),
          status_c: studentData.status || 'active',
          grade_level_c: studentData.gradeLevel,
          gpa_c: 0.0
        }]
      };

      const response = await apperClient.createRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} students:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdStudent = successful[0].data;
          return {
            Id: createdStudent.Id,
            firstName: createdStudent.first_name_c || '',
            lastName: createdStudent.last_name_c || '',
            studentId: createdStudent.student_id_c || '',
            email: createdStudent.email_c || '',
            phone: createdStudent.phone_c || '',
            enrollmentDate: createdStudent.enrollment_date_c || '',
            status: createdStudent.status_c || 'active',
            gradeLevel: createdStudent.grade_level_c || '',
            gpa: createdStudent.gpa_c || 0.0
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, studentData) {
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
          Name: `${studentData.firstName} ${studentData.lastName}`,
          first_name_c: studentData.firstName,
          last_name_c: studentData.lastName,
          student_id_c: studentData.studentId,
          email_c: studentData.email,
          phone_c: studentData.phone || '',
          status_c: studentData.status,
          grade_level_c: studentData.gradeLevel,
          gpa_c: studentData.gpa || 0.0
        }]
      };

      const response = await apperClient.updateRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} students:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedStudent = successful[0].data;
          return {
            Id: updatedStudent.Id,
            firstName: updatedStudent.first_name_c || '',
            lastName: updatedStudent.last_name_c || '',
            studentId: updatedStudent.student_id_c || '',
            email: updatedStudent.email_c || '',
            phone: updatedStudent.phone_c || '',
            enrollmentDate: updatedStudent.enrollment_date_c || '',
            status: updatedStudent.status_c || 'active',
            gradeLevel: updatedStudent.grade_level_c || '',
            gpa: updatedStudent.gpa_c || 0.0
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} students:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      return false;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "gpa_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "first_name_c", "operator": "Contains", "values": [query]}
              ],
              "operator": ""
            },
            {
              "conditions": [
                {"fieldName": "last_name_c", "operator": "Contains", "values": [query]}
              ],
              "operator": ""
            },
            {
              "conditions": [
                {"fieldName": "email_c", "operator": "Contains", "values": [query]}
              ],
              "operator": ""
            },
            {
              "conditions": [
                {"fieldName": "student_id_c", "operator": "Contains", "values": [query]}
              ],
              "operator": ""
            }
          ]
        }],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        studentId: student.student_id_c || '',
        email: student.email_c || '',
        phone: student.phone_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        status: student.status_c || 'active',
        gradeLevel: student.grade_level_c || '',
        gpa: student.gpa_c || 0.0
      }));
    } catch (error) {
      console.error("Error searching students:", error?.response?.data?.message || error);
      return [];
    }
  },

  async filterByStatus(status) {
    try {
      if (!status) return this.getAll();
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "gpa_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        studentId: student.student_id_c || '',
        email: student.email_c || '',
        phone: student.phone_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        status: student.status_c || 'active',
        gradeLevel: student.grade_level_c || '',
        gpa: student.gpa_c || 0.0
      }));
    } catch (error) {
      console.error("Error filtering students by status:", error?.response?.data?.message || error);
      return [];
    }
  },

  async filterByGradeLevel(gradeLevel) {
    try {
      if (!gradeLevel) return this.getAll();
      
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_level_c"}},
          {"field": {"Name": "gpa_c"}}
        ],
        where: [{"FieldName": "grade_level_c", "Operator": "EqualTo", "Values": [gradeLevel]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('student_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(student => ({
        Id: student.Id,
        firstName: student.first_name_c || '',
        lastName: student.last_name_c || '',
        studentId: student.student_id_c || '',
        email: student.email_c || '',
        phone: student.phone_c || '',
        enrollmentDate: student.enrollment_date_c || '',
        status: student.status_c || 'active',
        gradeLevel: student.grade_level_c || '',
        gpa: student.gpa_c || 0.0
      }));
    } catch (error) {
      console.error("Error filtering students by grade level:", error?.response?.data?.message || error);
      return [];
    }
  }
};
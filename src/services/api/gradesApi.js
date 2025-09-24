import { toast } from 'react-toastify';

export const gradesApi = {
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
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "submission_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "feedback_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "assignment_id_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected format
      return response.data.map(grade => ({
        Id: grade.Id,
        score: grade.score_c || 0,
        submissionDate: grade.submission_date_c || '',
        status: grade.status_c || 'pending',
        feedback: grade.feedback_c || '',
        studentId: grade.student_id_c?.Id || grade.student_id_c,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c
      }));
    } catch (error) {
      console.error("Error fetching grades:", error?.response?.data?.message || error);
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
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "submission_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "feedback_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "assignment_id_c"}}
        ]
      };

      const response = await apperClient.getRecordById('grade_c', id, params);
      
      if (!response?.data) {
        return null;
      }

      const grade = response.data;
      return {
        Id: grade.Id,
        score: grade.score_c || 0,
        submissionDate: grade.submission_date_c || '',
        status: grade.status_c || 'pending',
        feedback: grade.feedback_c || '',
        studentId: grade.student_id_c?.Id || grade.student_id_c,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c
      };
    } catch (error) {
      console.error(`Error fetching grade ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  },

  async create(gradeData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: `Grade for ${gradeData.studentId}`,
          score_c: gradeData.score,
          submission_date_c: gradeData.submissionDate || new Date().toISOString(),
          status_c: gradeData.status || 'graded',
          feedback_c: gradeData.feedback || '',
          student_id_c: parseInt(gradeData.studentId),
          assignment_id_c: parseInt(gradeData.assignmentId)
        }]
      };

      const response = await apperClient.createRecord('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} grades:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdGrade = successful[0].data;
          return {
            Id: createdGrade.Id,
            score: createdGrade.score_c || 0,
            submissionDate: createdGrade.submission_date_c || '',
            status: createdGrade.status_c || 'pending',
            feedback: createdGrade.feedback_c || '',
            studentId: createdGrade.student_id_c?.Id || createdGrade.student_id_c,
            assignmentId: createdGrade.assignment_id_c?.Id || createdGrade.assignment_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating grade:", error?.response?.data?.message || error);
      return null;
    }
  },

  async update(id, gradeData) {
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
          Name: `Grade for ${gradeData.studentId}`,
          score_c: gradeData.score,
          submission_date_c: gradeData.submissionDate,
          status_c: gradeData.status,
          feedback_c: gradeData.feedback || '',
          student_id_c: parseInt(gradeData.studentId),
          assignment_id_c: parseInt(gradeData.assignmentId)
        }]
      };

      const response = await apperClient.updateRecord('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} grades:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedGrade = successful[0].data;
          return {
            Id: updatedGrade.Id,
            score: updatedGrade.score_c || 0,
            submissionDate: updatedGrade.submission_date_c || '',
            status: updatedGrade.status_c || 'pending',
            feedback: updatedGrade.feedback_c || '',
            studentId: updatedGrade.student_id_c?.Id || updatedGrade.student_id_c,
            assignmentId: updatedGrade.assignment_id_c?.Id || updatedGrade.assignment_id_c
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating grade:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} grades:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error("Error deleting grade:", error?.response?.data?.message || error);
      return false;
    }
  },

  async getByStudent(studentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "submission_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "feedback_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "assignment_id_c"}}
        ],
        where: [{"FieldName": "student_id_c", "Operator": "EqualTo", "Values": [parseInt(studentId)]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        score: grade.score_c || 0,
        submissionDate: grade.submission_date_c || '',
        status: grade.status_c || 'pending',
        feedback: grade.feedback_c || '',
        studentId: grade.student_id_c?.Id || grade.student_id_c,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c
      }));
    } catch (error) {
      console.error("Error fetching grades by student:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByAssignment(assignmentId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "submission_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "feedback_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "assignment_id_c"}}
        ],
        where: [{"FieldName": "assignment_id_c", "Operator": "EqualTo", "Values": [parseInt(assignmentId)]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        score: grade.score_c || 0,
        submissionDate: grade.submission_date_c || '',
        status: grade.status_c || 'pending',
        feedback: grade.feedback_c || '',
        studentId: grade.student_id_c?.Id || grade.student_id_c,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c
      }));
    } catch (error) {
      console.error("Error fetching grades by assignment:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByStatus(status) {
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
          {"field": {"Name": "score_c"}},
          {"field": {"Name": "submission_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "feedback_c"}},
          {"field": {"Name": "student_id_c"}},
          {"field": {"Name": "assignment_id_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };

      const response = await apperClient.fetchRecords('grade_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(grade => ({
        Id: grade.Id,
        score: grade.score_c || 0,
        submissionDate: grade.submission_date_c || '',
        status: grade.status_c || 'pending',
        feedback: grade.feedback_c || '',
        studentId: grade.student_id_c?.Id || grade.student_id_c,
        assignmentId: grade.assignment_id_c?.Id || grade.assignment_id_c
      }));
    } catch (error) {
      console.error("Error fetching grades by status:", error?.response?.data?.message || error);
      return [];
    }
  }
};